'use client';

import React from 'react';
import { BookOpen, TrendingUp, MapPin, Clock, CheckCircle2, CalendarDays } from 'lucide-react';
import { CourseRegistration } from '@/data/mockData';

interface EnrollmentSummaryCardProps {
  registrations: CourseRegistration[];
  creditLimit: number;
}

const DAYS = ['월', '화', '수', '목', '금'] as const;
const PERIODS = Array.from({ length: 9 }, (_, i) => i + 1);

const PALETTE = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
];

interface ScheduleSlot {
  day: string;
  periods: number[];
}

function parseSchedule(schedule: string): ScheduleSlot[] {
  return schedule
    .split('/')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const [day, periodsPart] = token.split(/\s+/);
      const periods = (periodsPart || '')
        .split(',')
        .map((p) => parseInt(p, 10))
        .filter((n) => !Number.isNaN(n));
      return { day, periods };
    });
}

export default function EnrollmentSummaryCard({ registrations, creditLimit }: EnrollmentSummaryCardProps) {
  const totalCredits = registrations.reduce((acc, curr) => acc + curr.credits, 0);

  const coursesWithColor = registrations.map((course, index) => ({
    ...course,
    color: PALETTE[index % PALETTE.length],
    slots: parseSchedule(course.schedule),
  }));

  const findCourseAt = (day: string, period: number) =>
    coursesWithColor.find((course) => course.slots.some((slot) => slot.day === day && slot.periods.includes(period)));

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-850 mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-500" />
          금학기 수강신청 확인
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm">최종 수강신청이 완료된 과목과 신청 학점 현황입니다.</p>
      </div>

      {/* 신청학점 진행률 */}
      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            신청학점 현황
          </span>
          <span className="text-xs text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
            {totalCredits} / {creditLimit}학점
          </span>
        </div>
        <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalCredits / creditLimit) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* 신청 확정 과목 리스트 */}
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">신청 확정 과목 ({registrations.length})</h4>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200/60 shadow-sm bg-white mb-6">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 font-bold text-slate-600">
              <th className="py-3.5 px-4 font-bold">학수번호</th>
              <th className="py-3.5 px-4 font-bold">교과목명</th>
              <th className="py-3.5 px-4 font-bold">담당교수</th>
              <th className="py-3.5 px-3 font-bold text-center">학점</th>
              <th className="py-3.5 px-4 font-bold">시간</th>
              <th className="py-3.5 px-4 font-bold">강의실</th>
              <th className="py-3.5 px-4 font-bold text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registrations.map((item) => (
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
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    신청확정
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3 mb-6">
        {registrations.map((item) => (
          <div
            key={item.code}
            className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 shadow-sm hover:border-cyan-400/50 transition-all flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-center">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[9.5px] font-bold">
                {item.credits}학점
              </span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">{item.code}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-850 text-sm sm:text-base">{item.subject}</h4>
              <div className="text-[10px] text-slate-400 mt-0.5 font-bold">{item.professor} 교수</div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-200/50 pt-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate font-medium text-slate-500">{item.classroom}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 justify-end">
                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700">{item.schedule}</span>
              </div>
            </div>
            <div className="border-t border-slate-200/50 pt-2.5 flex justify-end">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                신청확정
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 시간표 미리보기 */}
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <CalendarDays className="w-3.5 h-3.5" />
        시간표 미리보기
      </h4>
      <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm">
        <table className="w-full border-collapse text-center text-[10px] sm:text-xs table-fixed">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold">
              <th className="py-2 px-1 w-10">교시</th>
              {DAYS.map((day) => (
                <th key={day} className="py-2 px-1">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PERIODS.map((period) => (
              <tr key={period}>
                <td className="py-1.5 px-1 text-slate-400 font-bold border-r border-slate-100">{period}</td>
                {DAYS.map((day) => {
                  const course = findCourseAt(day, period);
                  return (
                    <td key={day} className="p-0.5 h-9 align-middle">
                      {course ? (
                        <div className={`h-full rounded-md flex items-center justify-center px-1 border ${course.color.bg} ${course.color.text} ${course.color.border} truncate font-bold`}>
                          {course.subject}
                        </div>
                      ) : (
                        <div className="h-full" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 px-1">
        {coursesWithColor.map((course) => (
          <span key={course.code} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <span className={`w-2 h-2 rounded-full ${course.color.dot}`} />
            {course.subject}
          </span>
        ))}
      </div>
    </div>
  );
}
