'use client';

import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { TimetableItem } from '@/data/mockData';

interface TimetableCardProps {
  data: TimetableItem[];
}

const DAYS = ['월', '화', '수', '목', '금'] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// 각 교시의 실제 시간 안내
const PERIOD_TIMES: Record<number, string> = {
  1: '09:00 - 10:00',
  2: '10:00 - 11:00',
  3: '11:00 - 12:00',
  4: '12:00 - 13:00',
  5: '13:00 - 14:00',
  6: '14:00 - 15:00',
  7: '15:00 - 16:00',
  8: '16:00 - 17:00',
  9: '17:00 - 18:00',
};

const DAY_MAP: Record<string, number> = {
  '월': 1,
  '화': 2,
  '수': 3,
  '목': 4,
  '금': 5,
};

export default function TimetableCard({ data }: TimetableCardProps) {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-blue-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            나의 주간 시간표
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">2026학년도 1학기 등록된 수강 과목의 강의 시간 및 강의실 정보입니다.</p>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Timetable Grid System */}
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
            <div className="py-2 bg-slate-800/40 rounded-lg">교시</div>
            {DAYS.map((day) => (
              <div key={day} className="py-2 bg-slate-800/40 rounded-lg text-white">
                {day}요일
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-2 relative">
            {/* Hour Labels (Left column) */}
            <div className="flex flex-col gap-2">
              {PERIODS.map((p) => (
                <div 
                  key={p} 
                  className="h-20 bg-slate-800/20 border border-slate-800/50 rounded-xl flex flex-col justify-center items-center text-slate-400"
                >
                  <span className="font-bold text-white text-sm">{p}교시</span>
                  <span className="text-[10px] scale-90 text-slate-500">{PERIOD_TIMES[p].split(' - ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Timetable grid cells background */}
            {DAYS.map((day) => (
              <div key={day} className="relative flex flex-col gap-2 h-full">
                {PERIODS.map((p) => {
                  // 해당 요일 및 교시에 해당하는 과목 정보 탐색
                  const item = data.find(
                    (t) => t.day === day && t.period.includes(p)
                  );

                  // 만약 해당 과목이 있고, 현재 교시가 수업의 시작 교시인 경우에만 렌더링
                  // (그렇지 않으면 셀 크기가 늘어나므로 다른 중복 교시는 숨김)
                  const isStartPeriod = item && item.period[0] === p;

                  if (item) {
                    if (isStartPeriod) {
                      const duration = item.period.length;
                      // h-20은 단일 교시 높이, gap-2가 8px이므로 총 높이 계산
                      // (duration * 80px) + ((duration - 1) * 8px)
                      const heightPx = duration * 80 + (duration - 1) * 8;
                      // absolute 배치된 요소는 flex 정렬에서 빠지므로, 시작 교시 앞의 칸 수만큼
                      // 직접 top으로 내려주지 않으면 실제 시작 교시와 무관하게 항상 맨 위(1교시)에 그려진다.
                      const topPx = (item.period[0] - 1) * 80 + (item.period[0] - 1) * 8;

                      return (
                        <div
                          key={`${day}-${p}`}
                          style={{ height: `${heightPx}px`, top: `${topPx}px` }}
                          className={`absolute w-full z-10 p-3 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-md ${item.color || 'bg-slate-800 border-slate-700 text-slate-300'}`}
                        >
                          <div>
                            <div className="font-bold text-xs truncate">{item.subject}</div>
                            <div className="text-[10px] opacity-75 mt-0.5 flex items-center gap-1">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span>{item.professor}</span>
                            </div>
                          </div>
                          <div className="text-[10px] opacity-75 flex items-center gap-1 border-t border-white/10 pt-1.5 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{item.room}</span>
                          </div>
                        </div>
                      );
                    } else {
                      // 시작 교시가 아니면 렌더링하지 않고 빈 공간을 유지 (absolute 배치이므로 아래 빈 placeholder를 채워야함)
                      return <div key={`${day}-${p}`} className="h-20 opacity-0 pointer-events-none" />;
                    }
                  }

                  // 비어 있는 교시
                  return (
                    <div 
                      key={`${day}-${p}`} 
                      className="h-20 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-slate-700/40 text-[10px]"
                    >
                      -
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Accordion/List View (Shown on small screens) */}
      <div className="md:hidden space-y-4">
        {DAYS.map((day) => {
          const dayLessons = data.filter((t) => t.day === day).sort((a, b) => a.period[0] - b.period[0]);
          if (dayLessons.length === 0) return null;

          return (
            <div key={day} className="bg-slate-800/30 rounded-xl p-4 border border-slate-800/80">
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                {day}요일 수업
              </div>
              <div className="space-y-2">
                {dayLessons.map((item) => (
                  <div 
                    key={`${item.subject}-${item.period.join('-')}`}
                    className={`p-3 rounded-lg border flex justify-between items-center ${item.color || 'bg-slate-800 border-slate-700'}`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{item.subject}</div>
                      <div className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{item.professor}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.room}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-slate-900/50 text-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.period.join(', ')}교시
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {PERIOD_TIMES[item.period[0]].split(' - ')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
