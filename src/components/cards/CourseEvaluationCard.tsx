'use client';

import React, { useState } from 'react';
import { ClipboardCheck, User, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { CourseRegistration } from '@/data/mockData';

interface CourseEvaluationCardProps {
  data: CourseRegistration[];
}

export default function CourseEvaluationCard({ data }: CourseEvaluationCardProps) {
  const [evaluatedCodes, setEvaluatedCodes] = useState<Set<string>>(
    () => new Set(data.filter((r) => r.evaluated).map((r) => r.code))
  );

  const handleEvaluate = (code: string) => {
    setEvaluatedCodes((prev) => new Set(prev).add(code));
  };

  const evaluatedCount = data.filter((r) => evaluatedCodes.has(r.code)).length;

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-blue-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="mb-5 pb-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-850 mb-1 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-500" />
            수업평가 실시
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">미실시 과목의 수업평가를 완료해 주세요. 평가는 학기 성적 확인에 도움이 됩니다.</p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <div className="bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl text-center min-w-[76px]">
            <div className="text-[11px] text-slate-500 font-semibold">평가완료</div>
            <div className="text-lg font-extrabold text-emerald-600">{evaluatedCount}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl text-center min-w-[76px]">
            <div className="text-[11px] text-slate-500 font-semibold">미실시</div>
            <div className="text-lg font-extrabold text-amber-600">{data.length - evaluatedCount}</div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200/60 shadow-sm bg-white">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 font-bold text-slate-600">
              <th className="py-3.5 px-4 font-bold">학수번호</th>
              <th className="py-3.5 px-4 font-bold">교과목명</th>
              <th className="py-3.5 px-4 font-bold">담당교수</th>
              <th className="py-3.5 px-3 font-bold text-center">학점</th>
              <th className="py-3.5 px-4 font-bold">시간</th>
              <th className="py-3.5 px-4 font-bold">강의실</th>
              <th className="py-3.5 px-4 font-bold text-right">수업평가</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => {
              const evaluated = evaluatedCodes.has(item.code);
              return (
                <tr key={item.code} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 font-bold">{item.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.subject}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{item.professor} 교수</td>
                  <td className="py-3 px-3 font-bold text-slate-650 text-center">{item.credits}학점</td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.schedule}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/20">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.classroom}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {evaluated ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        완료
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEvaluate(item.code)}
                        className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-all cursor-pointer active:scale-95"
                      >
                        평가하기
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {data.map((item) => {
          const evaluated = evaluatedCodes.has(item.code);
          return (
            <div
              key={item.code}
              className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 shadow-sm transition-all flex flex-col gap-2.5 hover:border-blue-400/50"
            >
              <div className="flex justify-between items-center">
                <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[9.5px] font-bold">
                  {item.credits}학점
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-mono">{item.code}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm sm:text-base">{item.subject}</h4>
              </div>

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
                  <span>{item.schedule}</span>
                </div>
              </div>

              <div className="border-t border-slate-200/50 pt-2.5 flex justify-end">
                {evaluated ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    수업평가 완료
                  </span>
                ) : (
                  <button
                    onClick={() => handleEvaluate(item.code)}
                    className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-all cursor-pointer active:scale-95"
                  >
                    평가하기
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
