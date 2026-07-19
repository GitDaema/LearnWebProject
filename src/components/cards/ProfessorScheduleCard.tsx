'use client';

import React, { useMemo, useState } from 'react';
import { User, Search, MapPin, Clock, IdCard, Building2 } from 'lucide-react';
import { DepartmentSubject, Professor } from '@/data/mockData';

interface ProfessorScheduleCardProps {
  directory: Professor[];
  schedule: DepartmentSubject[];
  initialProfessor?: Professor;
}

const CLASSIFICATION_COLORS: Record<DepartmentSubject['classification'], string> = {
  전필: 'bg-amber-50 text-amber-700 border-amber-200/80',
  전선: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  기전: 'bg-sky-50 text-sky-705 border-sky-200/80',
  교필: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  교선: 'bg-rose-50 text-rose-700 border-rose-200/80',
};

export default function ProfessorScheduleCard({ directory, schedule, initialProfessor }: ProfessorScheduleCardProps) {
  const [query, setQuery] = useState(initialProfessor ? initialProfessor.name : '');
  const [selected, setSelected] = useState<Professor | null>(initialProfessor || null);
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];
    return directory
      .filter((p) => p.name.toLowerCase().includes(cleanQuery) || p.department.toLowerCase().includes(cleanQuery))
      .slice(0, 8);
  }, [directory, query]);

  const handleSelect = (professor: Professor) => {
    setSelected(professor);
    setQuery(professor.name);
    setIsOpen(false);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelected(null);
    setIsOpen(value.trim().length > 0);
  };

  const professorClasses = selected
    ? schedule.filter((item) => item.professorId === selected.id)
    : [];

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-100 relative overflow-visible transition-all duration-300 hover:border-blue-500/30">
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-850 mb-1 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          담당교수별 시간표 조회
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm">교수님 성함을 검색하여 담당 강의의 시간 및 강의실을 확인하세요.</p>
      </div>

      {/* Search Input + Autocomplete */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsOpen(query.trim().length > 0)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            onKeyDown={(e) => { if (e.key === 'Escape') setIsOpen(false); }}
            placeholder="교수명 또는 소속 학과로 검색 (예: 김민준, 컴퓨터공학과)"
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-400 transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto z-10">
            {suggestions.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {suggestions.map((professor) => (
                  <li key={professor.id}>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(professor)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                    >
                      <span className="font-bold text-sm text-slate-800">{professor.name}</span>
                      <span className="text-[11px] text-slate-450 flex items-center gap-1 flex-shrink-0">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {professor.department}
                        <span className="text-slate-300">/</span>
                        <IdCard className="w-3 h-3 text-slate-400" />
                        {professor.id}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {!selected ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-400 font-medium">
          교수명을 검색해 담당 시간표를 확인하세요.
        </div>
      ) : (
        <>
          {/* Selected professor summary */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm sm:text-base">{selected.name} 교수</div>
              <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3 h-3 text-slate-400" />
                {selected.department}
                <span className="text-slate-300">·</span>
                <IdCard className="w-3 h-3 text-slate-400" />
                {selected.id}
              </div>
            </div>
          </div>

          {professorClasses.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-8 text-center text-slate-400 text-xs sm:text-sm font-medium">
              이번 학기 개설된 담당 강의가 없습니다.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200/60 shadow-sm bg-white">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 font-bold text-slate-600">
                      <th className="py-3.5 px-4 font-bold">학년</th>
                      <th className="py-3.5 px-3 font-bold">구분</th>
                      <th className="py-3.5 px-3 font-bold">학수번호</th>
                      <th className="py-3.5 px-4 font-bold">교과목명</th>
                      <th className="py-3.5 px-3 font-bold text-center">분반</th>
                      <th className="py-3.5 px-3 font-bold text-center">학점</th>
                      <th className="py-3.5 px-4 font-bold">시간</th>
                      <th className="py-3.5 px-4 font-bold">강의실</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {professorClasses.map((item) => (
                      <tr key={`${item.code}-${item.classGroup}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-500">{item.grade}학년</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${CLASSIFICATION_COLORS[item.classification]}`}>
                            {item.classification}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400 font-bold">{item.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{item.subject}</td>
                        <td className="py-3 px-3 font-bold text-slate-550 text-center">{item.classGroup}분반</td>
                        <td className="py-3 px-3 font-bold text-slate-650 text-center">{item.credits}학점</td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.time}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/20">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.classroom}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {professorClasses.map((item) => (
                  <div
                    key={`${item.code}-${item.classGroup}`}
                    className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 shadow-sm hover:border-blue-400/50 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1.5">
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9.5px] font-bold">
                          {item.grade}학년
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${CLASSIFICATION_COLORS[item.classification]}`}>
                          {item.classification}
                        </span>
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[9.5px] font-bold">
                          {item.credits}학점
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">{item.code}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-850 text-sm sm:text-base">{item.subject}</h4>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-bold">{item.classGroup}분반</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200/50 pt-2.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate font-medium text-slate-500">{item.classroom}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0 justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
