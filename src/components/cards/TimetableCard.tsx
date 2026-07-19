'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen, Search, User, MapPin, Clock, Award, Filter, RefreshCw } from 'lucide-react';
import { DepartmentSubject } from '@/data/mockData';

interface TimetableCardProps {
  data: DepartmentSubject[];
}

const CLASSIFICATION_COLORS: Record<DepartmentSubject['classification'], string> = {
  전필: 'bg-amber-50 text-amber-700 border-amber-200/80',
  전선: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  기전: 'bg-sky-50 text-sky-705 border-sky-200/80',
  교필: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  교선: 'bg-rose-50 text-rose-700 border-rose-200/80',
};

export default function TimetableCard({ data }: TimetableCardProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<DepartmentSubject['classification'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 필터 초기화
  const handleResetFilters = () => {
    setSelectedGrade('all');
    setSelectedClass('all');
    setSearchTerm('');
  };

  // 필터링 및 검색된 과목 목록 계산
  const filteredSubjects = useMemo(() => {
    return data.filter((item) => {
      const matchGrade = selectedGrade === 'all' || item.grade === selectedGrade;
      const matchClass = selectedClass === 'all' || item.classification === selectedClass;

      const cleanSearch = searchTerm.trim().toLowerCase();
      const matchSearch = !cleanSearch ||
        item.subject.toLowerCase().includes(cleanSearch) ||
        item.professor.toLowerCase().includes(cleanSearch) ||
        item.code.toLowerCase().includes(cleanSearch);

      return matchGrade && matchClass && matchSearch;
    });
  }, [data, selectedGrade, selectedClass, searchTerm]);

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-blue-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="mb-5 pb-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-850 mb-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            컴퓨터공학과 개설 교과목 정보
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">2026학년도 1학기 컴퓨터공학과에 개설된 모든 과목의 시간 및 강의실 안내입니다.</p>
        </div>
      </div>

      {/* Filter and Search Section - 피로도를 줄여주는 핵심 UI */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 mb-5 space-y-3.5">
        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          {/* 학년 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">학년</span>
            <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm">
              {(['all', 1, 2, 3, 4] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {grade === 'all' ? '전체' : `${grade}학년`}
                </button>
              ))}
            </div>
          </div>

          {/* 이수구분 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">이수구분</span>
            <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm">
              {(['all', '전필', '전선', '기전', '교필', '교선'] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cls === 'all' ? '전체' : cls}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 검색 및 필터 초기화 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="교과목명, 담당교수, 학수번호로 빠른 검색..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-blue-400 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
          {(selectedGrade !== 'all' || selectedClass !== 'all' || searchTerm) && (
            <button
              onClick={handleResetFilters}
              className="bg-white hover:bg-slate-100 text-slate-550 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              필터 초기화
            </button>
          )}
        </div>
      </div>

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
              <th className="py-3.5 px-4 font-bold">담당교수</th>
              <th className="py-3.5 px-4 font-bold">강의실</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((item) => (
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
                  <td className="py-3 px-4 text-xs font-semibold text-slate-700 flex items-center gap-1.5 pt-4">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.time}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">{item.professor} 교수</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/20">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.classroom}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 text-xs sm:text-sm font-medium">
                  조건에 일치하는 개설 교과목이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Shown on small/medium screens) - 눈이 피로하지 않은 레이아웃 */}
      <div className="lg:hidden space-y-3">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((item) => (
            <div
              key={`${item.code}-${item.classGroup}`}
              className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 shadow-sm hover:border-blue-400/50 transition-all flex flex-col gap-2.5 relative"
            >
              {/* Badge line */}
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

              {/* Title & Division */}
              <div>
                <h4 className="font-bold text-slate-850 text-sm sm:text-base">{item.subject}</h4>
                <div className="text-[10px] text-slate-400 mt-0.5 font-bold">{item.classGroup}분반</div>
              </div>

              {/* Detail row */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-200/50 pt-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate font-bold text-slate-700">{item.professor} 교수</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate font-medium text-slate-500">{item.classroom}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 pt-0.5 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-8 text-center text-slate-400 text-xs font-medium">
            조건에 일치하는 개설 교과목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
