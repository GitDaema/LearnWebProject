'use client';

import React, { useState } from 'react';
import { BookOpen, MapPin, User, Clock, CheckSquare, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { Syllabus } from '@/data/mockData';

interface SyllabusCardProps {
  data: Syllabus;
}

export default function SyllabusCard({ data }: SyllabusCardProps) {
  const [showWeeks, setShowWeeks] = useState(false);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

      {/* Header Info */}
      <div className="mb-6 pb-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold mb-1.5 inline-block">
            {data.code}
          </span>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            {data.subject} 강의계획서
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">교과목 강의 목표 및 주차별 학사 일정 상세 안내입니다.</p>
        </div>

        {/* Quick Parameters */}
        <div className="flex bg-slate-800/40 border border-slate-800 rounded-xl px-4 py-2 text-center text-xs gap-3 flex-shrink-0">
          <div>
            <div className="text-slate-500">이수학점</div>
            <div className="text-sm font-bold text-white mt-0.5">{data.credits}학점</div>
          </div>
          <div className="border-l border-slate-800" />
          <div>
            <div className="text-slate-500">강의시간</div>
            <div className="text-sm font-bold text-white mt-0.5">{data.schedule.split(' / ')[0]}</div>
          </div>
        </div>
      </div>

      {/* Grid: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 text-sm">
        {/* Core items (2/3 width on large screens) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-950/40 border border-slate-850 p-4.5 rounded-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              교과목 개요 및 목표
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {data.description}
            </p>
          </div>
        </div>

        {/* Info panel (1/3 width) */}
        <div className="space-y-3">
          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">담당교수</div>
              <div className="text-sm font-semibold text-white">{data.professor}</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">강의실</div>
              <div className="text-sm font-semibold text-white">{data.classroom}</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">전체 시간 구성</div>
              <div className="text-xs font-semibold text-white">{data.schedule}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion: Weekly Plan */}
      <div className="border-t border-slate-800 pt-5">
        <button
          onClick={() => setShowWeeks(!showWeeks)}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-850 p-4.5 rounded-xl flex justify-between items-center transition-all group active:scale-99"
        >
          <span className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            15주차 주간 강의 세부 계획
          </span>
          {showWeeks ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showWeeks && (
          <div className="mt-4 bg-slate-950/60 rounded-xl border border-slate-800 p-4 divide-y divide-slate-800/80 max-h-96 overflow-y-auto space-y-2.5">
            {data.weeklyPlan.map((week, idx) => (
              <div key={idx} className="pt-2.5 first:pt-0 text-xs sm:text-sm text-slate-300 flex gap-3">
                <span className="text-emerald-400 font-bold font-mono min-w-[40px] text-right">{idx + 1}주차</span>
                <span>{week.split(': ')[1] || week}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
