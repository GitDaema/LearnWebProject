'use client';

import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, AlertCircle, TrendingUp, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { SemesterGrade, GraduationRequirement } from '@/data/mockData';

interface GraduationRequirementCardProps {
  grades: SemesterGrade[];
  requirement: GraduationRequirement;
}

export default function GraduationRequirementCard({ grades, requirement }: GraduationRequirementCardProps) {
  const [showElectives, setShowElectives] = useState(false);
  const allCourses = grades.flatMap((semester) => semester.courses);
  const completedCodes = new Set(allCourses.map((c) => c.code));

  const majorCredits = allCourses
    .filter((c) => c.type.startsWith('전공'))
    .reduce((acc, c) => acc + c.credits, 0);
  const generalCredits = allCourses
    .filter((c) => c.type.startsWith('교양'))
    .reduce((acc, c) => acc + c.credits, 0);

  const majorRemaining = Math.max(requirement.majorCreditsRequired - majorCredits, 0);
  const generalRemaining = Math.max(requirement.generalCreditsRequired - generalCredits, 0);

  // 전공필수 과목 처리
  const requiredMajorCourses = requirement.requiredMajorCourses.map((course) => ({
    ...course,
    completed: completedCodes.has(course.code),
  }));
  const missingMajorCourses = requiredMajorCourses.filter((c) => !c.completed);

  // 교양필수 과목 처리
  const requiredGeneralCourses = requirement.requiredGeneralCourses.map((course) => ({
    ...course,
    completed: completedCodes.has(course.code),
  }));
  const missingGeneralCourses = requiredGeneralCourses.filter((c) => !c.completed);

  // 전체 미이수 필수과목
  const totalMissingRequired = missingMajorCourses.length + missingGeneralCourses.length;
  const isAllClear = majorRemaining === 0 && generalRemaining === 0 && totalMissingRequired === 0;

  // 선택과목 분리 추출 (전공선택 / 교양선택)
  const electiveMajorCourses = allCourses.filter((c) => c.type === '전공선택');
  const electiveGeneralCourses = allCourses.filter((c) => c.type === '교양선택');
  const totalElectivesCount = electiveMajorCourses.length + electiveGeneralCourses.length;

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-100 relative overflow-visible transition-all duration-300 hover:border-purple-500/30">
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-850 mb-1 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-500" />
          졸업 자격 자가진단
        </h3>
        <p className="text-slate-500 text-xs">{requirement.major} 졸업 기준 대비 현재까지의 이수 현황입니다.</p>
      </div>

      {/* 결론 요약 배너 */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex gap-3 mb-5">
        {isAllClear ? (
          <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        ) : (
          <GraduationCap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        )}
        <p className="text-xs sm:text-sm text-purple-800 font-bold leading-relaxed">
          {isAllClear
            ? '축하합니다! 현재까지 졸업 학점·필수요건을 모두 충족했습니다.'
            : `졸업까지 전공 ${majorRemaining}학점 · 교양 ${generalRemaining}학점 · 필수 ${totalMissingRequired}과목이 더 필요합니다.`}
        </p>
      </div>

      {/* [전공 / 교양] 진행률 바 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* 좌측: 전공 이수 학점 */}
        <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              전공 이수 학점
            </span>
            <span className="text-[10px] sm:text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {majorCredits} / {requirement.majorCreditsRequired}학점
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((majorCredits / requirement.majorCreditsRequired) * 100, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-450 font-semibold mt-1.5">
            {majorRemaining > 0 ? `${majorRemaining}학점 남음` : '기준 충족'}
          </div>
        </div>

        {/* 우측: 교양 이수 학점 */}
        <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              교양 이수 학점
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {generalCredits} / {requirement.generalCreditsRequired}학점
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((generalCredits / requirement.generalCreditsRequired) * 100, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-450 font-semibold mt-1.5">
            {generalRemaining > 0 ? `${generalRemaining}학점 남음` : '기준 충족'}
          </div>
        </div>
      </div>

      {/* [전공필수 / 교양필수] 체크리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* 좌측: 전공필수 체크리스트 */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex justify-between items-center">
            <span>전공필수 이수 현황</span>
            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {requiredMajorCourses.length - missingMajorCourses.length} / {requiredMajorCourses.length}
            </span>
          </h4>
          <ul className="space-y-1.5">
            {requiredMajorCourses.map((course) => (
              <li
                key={course.code}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 border ${
                  course.completed
                    ? 'bg-slate-50 border-slate-200/50'
                    : 'bg-rose-50 border-rose-200/80'
                }`}
              >
                {course.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                )}
                <span className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                  <span className={`font-bold text-xs ${course.completed ? 'text-slate-800' : 'text-rose-700'}`}>
                    {course.subject}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{course.code}</span>
                  <span className={`px-1 py-0.2 text-[9px] font-bold rounded ${
                    course.completed
                      ? 'bg-slate-200/40 text-slate-500'
                      : 'bg-rose-100 text-rose-500'
                  }`}>
                    {course.credits}학점
                  </span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                  course.completed
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-100 text-rose-600 border-rose-200/80'
                }`}>
                  {course.completed ? '이수완료' : '미이수'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측: 교양필수 체크리스트 */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex justify-between items-center">
            <span>교양필수 이수 현황</span>
            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {requiredGeneralCourses.length - missingGeneralCourses.length} / {requiredGeneralCourses.length}
            </span>
          </h4>
          <ul className="space-y-1.5">
            {requiredGeneralCourses.map((course) => (
              <li
                key={course.code}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 border ${
                  course.completed
                    ? 'bg-slate-50 border-slate-200/50'
                    : 'bg-rose-50 border-rose-200/80'
                }`}
              >
                {course.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                )}
                <span className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                  <span className={`font-bold text-xs ${course.completed ? 'text-slate-800' : 'text-rose-700'}`}>
                    {course.subject}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{course.code}</span>
                  <span className={`px-1 py-0.2 text-[9px] font-bold rounded ${
                    course.completed
                      ? 'bg-slate-200/40 text-slate-500'
                      : 'bg-rose-100 text-rose-500'
                  }`}>
                    {course.credits}학점
                  </span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                  course.completed
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-100 text-rose-600 border-rose-200/80'
                }`}>
                  {course.completed ? '이수완료' : '미이수'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 선택 과목 이수 내역 (전공선택 / 교양선택 좌우 분할 더보기) */}
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowElectives(!showElectives)}
          className="w-full flex items-center justify-between py-2 px-3 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-700 font-bold text-xs sm:text-sm transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            선택 과목 이수 내역 (전공선택 / 교양선택)
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100/50 font-mono">
              {totalElectivesCount}개 과목
            </span>
          </span>
          {showElectives ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showElectives && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            {/* 좌측: 전공선택 이수 과목 */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex justify-between items-center">
                <span>전공선택 이수 과목</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-mono">
                  {electiveMajorCourses.length}개 과목
                </span>
              </h4>
              {electiveMajorCourses.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium bg-slate-50/50 border border-dashed border-slate-200/40 rounded-xl">
                  이수한 전공선택 과목이 없습니다.
                </div>
              ) : (
                <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1 font-sans">
                  {electiveMajorCourses.map((course, index) => (
                    <li
                      key={`${course.code}-${index}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 border bg-slate-50/40 border-slate-200/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-800">
                          {course.subject}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{course.code}</span>
                        <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-slate-200/40 text-slate-500 font-mono">
                          {course.credits}학점
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 bg-emerald-50 text-emerald-600 border-emerald-100">
                        이수완료
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 우측: 교양선택 이수 과목 */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex justify-between items-center">
                <span>교양선택 이수 과목</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-mono">
                  {electiveGeneralCourses.length}개 과목
                </span>
              </h4>
              {electiveGeneralCourses.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium bg-slate-50/50 border border-dashed border-slate-200/40 rounded-xl">
                  이수한 교양선택 과목이 없습니다.
                </div>
              ) : (
                <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1 font-sans">
                  {electiveGeneralCourses.map((course, index) => (
                    <li
                      key={`${course.code}-${index}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 border bg-slate-50/40 border-slate-200/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-800">
                          {course.subject}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{course.code}</span>
                        <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-slate-200/40 text-slate-500 font-mono">
                          {course.credits}학점
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 bg-emerald-50 text-emerald-600 border-emerald-100">
                        이수완료
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
