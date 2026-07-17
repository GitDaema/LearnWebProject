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
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            성적 조회 내역
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">학기별 성적 단표 내역 및 전체 평점 평균 정보입니다.</p>
        </div>

        {/* Highlight Stats */}
        <div className="flex gap-4">
          <div className="bg-slate-800/80 border border-slate-800 px-4 py-2 rounded-xl text-center min-w-[80px]">
            <div className="text-xs text-slate-400">평점평균</div>
            <div className="text-lg font-bold text-emerald-400">{averageGpa} <span className="text-xs text-slate-400">/ 4.5</span></div>
          </div>
          <div className="bg-slate-800/80 border border-slate-800 px-4 py-2 rounded-xl text-center min-w-[80px]">
            <div className="text-xs text-slate-400">취득학점</div>
            <div className="text-lg font-bold text-blue-400">{totalCredits} <span className="text-xs text-slate-400">학점</span></div>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-250 ${
                activeSemester === g.semesterName
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-inner shadow-emerald-500/10'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {g.semesterName}
            </button>
          ))}
        </div>
      )}

      {/* GPA Progress Bar Visualizer */}
      {currentGrading && (
        <div className="bg-slate-850/40 border border-slate-800/80 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {currentGrading.semesterName} 학업 성취도
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              GPA {currentGrading.gpa} / 4.5
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
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
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="bg-slate-855 border border-slate-800 text-slate-400 font-semibold rounded-t-xl text-xs uppercase">
                <th className="px-4 py-3">교과목명</th>
                <th className="px-4 py-3 hidden sm:table-cell">과목코드</th>
                <th className="px-4 py-3">이수구분</th>
                <th className="px-4 py-3 text-center">학점</th>
                <th className="px-4 py-3 text-right">등급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currentGrading.courses.map((course) => (
                <tr 
                  key={course.code}
                  className="hover:bg-slate-800/35 transition-colors duration-150"
                >
                  <td className="px-4 py-3.5 font-medium text-white">{course.subject}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-slate-400 font-mono text-xs">{course.code}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs border ${
                      course.type.startsWith('전공') 
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' 
                        : 'bg-slate-800 text-slate-400 border-slate-700/50'
                    }`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold">{course.credits}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      course.grade.startsWith('A') 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : course.grade.startsWith('B') 
                          ? 'text-blue-400 bg-blue-500/10' 
                          : 'text-amber-400 bg-amber-500/10'
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
