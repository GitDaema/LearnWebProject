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
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-purple-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-850 mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            전자출결 현황 조회
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">현재 학기 수강 과목의 출결 분석 및 공결 신청 진행 상황입니다.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-md shadow-purple-500/10 active:scale-95 cursor-pointer select-none">
          <FileText className="w-3.5 h-3.5" />
          신규 공결 신청
        </button>
      </div>

      {/* Course Attendance List */}
      <div className="space-y-4 mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">과목별 출결 정보</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendance.map((item) => {
            // 출석 비율 색상 정의
            const isDanger = item.rate < 90;
            const rateColor = isDanger ? 'text-rose-600' : 'text-purple-600';
            const rateBg = isDanger ? 'bg-rose-50' : 'bg-purple-50';
            const progressColor = isDanger ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500';

            return (
              <div 
                key={item.subject} 
                className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{item.subject}</div>
                    <div className="text-[11px] text-slate-450 mt-0.5">총 수업: {item.totalHours}시간</div>
                  </div>
                  <span className={`text-xs font-extrabold ${rateColor} ${rateBg} px-2 py-0.5 rounded-lg border border-current/10`}>
                    {item.rate}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full mb-3 overflow-hidden">
                  <div 
                    className={`${progressColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>

                {/* Stats Tags */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] sm:text-xs">
                  <div className="bg-emerald-50 text-emerald-600 px-1 py-1 rounded border border-emerald-100 font-bold">
                    <span className="block text-[8px] text-slate-400 font-bold scale-90 uppercase">출석</span>
                    <span>{item.attended}</span>
                  </div>
                  <div className="bg-amber-55/60 text-amber-600 px-1 py-1 rounded border border-amber-100 font-bold">
                    <span className="block text-[8px] text-slate-400 font-bold scale-90 uppercase">지각</span>
                    <span>{item.late}</span>
                  </div>
                  <div className="bg-rose-50 text-rose-600 px-1 py-1 rounded border border-rose-100 font-bold">
                    <span className="block text-[8px] text-slate-400 font-bold scale-90 uppercase">결석</span>
                    <span>{item.absent}</span>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-1 py-1 rounded border border-indigo-100 font-bold">
                    <span className="block text-[8px] text-slate-400 font-bold scale-90 uppercase">공결</span>
                    <span>{item.excused}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Leave list */}
      {officialLeaves && officialLeaves.length > 0 && (
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">공결 신청 및 내역</h4>
          <div className="overflow-x-auto bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 min-w-[500px]">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-500 font-bold text-xs">
                  <th className="px-4 py-3">공결구분코드</th>
                  <th className="px-4 py-3">대상 과목</th>
                  <th className="px-4 py-3">공결 신청 일자</th>
                  <th className="px-4 py-3">신청 사유</th>
                  <th className="px-4 py-3 text-right">결재 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {officialLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-100/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{leave.id}</td>
                    <td className="px-4 py-3 text-slate-800 font-bold">{leave.subject}</td>
                    <td className="px-4 py-3 text-slate-450">{leave.date}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{leave.reason}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        leave.status === '승인' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : leave.status === '대기' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
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
