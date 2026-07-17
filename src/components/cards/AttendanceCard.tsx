'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Clock, FileText, ChevronRight } from 'lucide-react';
import { AttendanceItem, OfficialLeave } from '@/data/mockData';

interface AttendanceCardProps {
  data: {
    attendance: AttendanceItem[];
    officialLeaves: OfficialLeave[];
  };
}

export default function AttendanceCard({ data }: AttendanceCardProps) {
  const { attendance, officialLeaves } = data;

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-purple-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            전자출결 현황 조회
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">현재 학기 수강 과목의 출결 분석 및 공결 신청 진행 상황입니다.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-lg shadow-purple-900/20 active:scale-95">
          <FileText className="w-3.5 h-3.5" />
          신규 공결 신청
        </button>
      </div>

      {/* Course Attendance List */}
      <div className="space-y-4 mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">과목별 출결 정보</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendance.map((item) => {
            // 출석 비율 색상 정의
            const isDanger = item.rate < 90;
            const rateColor = isDanger ? 'text-rose-400' : 'text-purple-400';
            const progressColor = isDanger ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500';

            return (
              <div 
                key={item.subject} 
                className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700/60 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-sm text-white">{item.subject}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">총 수업: {item.totalHours}시간</div>
                  </div>
                  <span className={`text-sm font-extrabold ${rateColor} bg-white/5 px-2 py-0.5 rounded-lg`}>
                    {item.rate}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700/50 h-2 rounded-full mb-3 overflow-hidden">
                  <div 
                    className={`${progressColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>

                {/* Stats Tags */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] sm:text-xs">
                  <div className="bg-emerald-500/10 text-emerald-400 px-1 py-1 rounded border border-emerald-500/10">
                    <span className="block text-[8px] text-slate-500 font-medium scale-90 uppercase">출석</span>
                    <span className="font-bold">{item.attended}</span>
                  </div>
                  <div className="bg-amber-500/10 text-amber-300 px-1 py-1 rounded border border-amber-500/10">
                    <span className="block text-[8px] text-slate-500 font-medium scale-90 uppercase">지각</span>
                    <span className="font-bold">{item.late}</span>
                  </div>
                  <div className="bg-rose-500/10 text-rose-400 px-1 py-1 rounded border border-rose-500/10">
                    <span className="block text-[8px] text-slate-500 font-medium scale-90 uppercase">결석</span>
                    <span className="font-bold">{item.absent}</span>
                  </div>
                  <div className="bg-indigo-500/10 text-indigo-300 px-1 py-1 rounded border border-indigo-500/10">
                    <span className="block text-[8px] text-slate-500 font-medium scale-90 uppercase">공결</span>
                    <span className="font-bold">{item.excused}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Leave list */}
      {officialLeaves && officialLeaves.length > 0 && (
        <div className="border-t border-slate-800/80 pt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">공결 신청 및 내역</h4>
          <div className="overflow-x-auto bg-slate-900/50 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[500px]">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-semibold text-xs">
                  <th className="px-4 py-3">공결구분코드</th>
                  <th className="px-4 py-3">대상 과목</th>
                  <th className="px-4 py-3">공결 신청 일자</th>
                  <th className="px-4 py-3">신청 사유</th>
                  <th className="px-4 py-3 text-right">결재 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {officialLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{leave.id}</td>
                    <td className="px-4 py-3 text-white font-medium">{leave.subject}</td>
                    <td className="px-4 py-3 text-slate-400">{leave.date}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{leave.reason}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        leave.status === '승인' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : leave.status === '대기' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
