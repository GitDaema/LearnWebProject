'use client';

import React, { useState } from 'react';
import { Award, BookOpen, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { SemesterGrade } from '@/data/mockData';

interface GradeCardProps {
  data: SemesterGrade[] | SemesterGrade;
}

export default function GradeCard({ data }: GradeCardProps) {
  const isArray = Array.isArray(data);
  const grades = isArray ? data : [data];
  
  // 전체 평점 및 총 취득 학점 계산
  const totalCredits = grades.reduce((acc, curr) => acc + curr.acquiredCredits, 0);
  const averageGpa = isArray 
    ? Number((grades.reduce((acc, curr) => acc + curr.gpa, 0) / grades.length).toFixed(2))
    : data.gpa;

  const [activeSemester, setActiveSemester] = useState<string>(grades[0]?.semesterName || '');

  const currentGrading = grades.find(g => g.semesterName === activeSemester) || grades[0];

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-850 mb-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            성적 조회 내역
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">학기별 성적 단표 내역 및 전체 평점 평균 정보입니다.</p>
        </div>

        {/* Highlight Stats */}
        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl text-center min-w-[80px]">
            <div className="text-[11px] text-slate-500 font-semibold">평점평균</div>
            <div className="text-lg font-extrabold text-emerald-600">{averageGpa} <span className="text-[11px] text-slate-400 font-normal">/ 4.5</span></div>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl text-center min-w-[80px]">
            <div className="text-[11px] text-slate-500 font-semibold">취득학점</div>
            <div className="text-lg font-extrabold text-blue-600">{totalCredits} <span className="text-[11px] text-slate-400 font-normal">학점</span></div>
          </div>
        </div>
      </div>

      {/* Semester Tabs */}
      {isArray && (
        <div className="flex flex-wrap gap-2 mb-6">
          {grades.map((g) => (
            <button
              key={g.semesterName}
              onClick={() => setActiveSemester(g.semesterName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-250 cursor-pointer ${
                activeSemester === g.semesterName
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                  : 'bg-slate-55/60 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {g.semesterName}
            </button>
          ))}
        </div>
      )}

      {/* GPA Progress Bar Visualizer */}
      {currentGrading && (
        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              {currentGrading.semesterName} 학업 성취도
            </span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              GPA {currentGrading.gpa} / 4.5
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentGrading.gpa / 4.5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Detailed Course Table */}
      {currentGrading && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-650">
            <thead>
              <tr className="bg-slate-50 border border-slate-200/60 text-slate-500 font-bold rounded-t-xl text-xs uppercase">
                <th className="px-4 py-3">교과목명</th>
                <th className="px-4 py-3 hidden sm:table-cell">과목코드</th>
                <th className="px-4 py-3">이수구분</th>
                <th className="px-4 py-3 text-center">학점</th>
                <th className="px-4 py-3 text-right">등급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGrading.courses.map((course) => (
                <tr 
                  key={course.code}
                  className="hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <td className="px-4 py-3.5 font-bold text-slate-800">{course.subject}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-slate-400 font-mono text-xs">{course.code}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs border font-semibold ${
                      course.type.startsWith('전공') 
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-700">{course.credits}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      course.grade.startsWith('A') 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : course.grade.startsWith('B') 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-amber-600 bg-amber-50'
                    }`}>
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
