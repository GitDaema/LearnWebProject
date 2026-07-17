'use client';

import React, { useState } from 'react';
import { UserCheck, FileInput, ArrowRightLeft, UserX, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AcademicRecord, StudentProfile } from '@/data/mockData';

interface AcademicCardProps {
  data: {
    type: 'leave' | 'return' | 'dropout';
    records: AcademicRecord[];
    profile: StudentProfile;
  };
}

export default function AcademicCard({ data }: AcademicCardProps) {
  const { type, records, profile } = data;
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    period: '1개 학기 (2026-2학기)',
    detailedReason: '',
  });

  const getTitle = () => {
    switch (type) {
      case 'leave': return '휴학 신청 서비스';
      case 'return': return '복학 신청 서비스';
      case 'dropout': return '자퇴 신청 서비스';
    }
  };

  const getIcon = (t: string) => {
    switch (t) {
      case 'leave': return <UserX className="w-5 h-5 text-amber-400" />;
      case 'return': return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'dropout': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      default: return <FileInput className="w-5 h-5" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            {getIcon(type)}
            {getTitle()}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">현재 학적 상태: <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{profile.status}</span></p>
        </div>
      </div>

      {/* Main Process Area */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Stepper Header */}
          <div className="flex justify-between items-center bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl text-xs sm:text-sm">
            <span className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-amber-400' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center scale-90">1</span>
              원서 작성
            </span>
            <span className="text-slate-600">→</span>
            <span className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-amber-400' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center scale-90">2</span>
              지도교수 상담
            </span>
            <span className="text-slate-600">→</span>
            <span className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center scale-90">3</span>
              최종 승인
            </span>
          </div>

          {/* Form Input fields */}
          <div className="space-y-3.5 bg-slate-800/20 border border-slate-800/60 p-4 rounded-xl">
            {type === 'leave' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">휴학 종류 및 기간</label>
                <select 
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
                >
                  <option>1개 학기 (2026학년도 2학기)</option>
                  <option>2개 학기 (2026-2학기 ~ 2027-1학기)</option>
                  <option>군 휴학 (의무복무기간)</option>
                  <option>질병 휴학 (진단서 첨부 요망)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">신청 사유</label>
              <select 
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
                required
              >
                <option value="">-- 사유를 선택하세요 --</option>
                {type === 'leave' && (
                  <>
                    <option value="일반가사">일반가사 및 개인사정</option>
                    <option value="군입대">군 입대 (의무 복무)</option>
                    <option value="어학연수">어학연수 및 인턴십</option>
                    <option value="질병치료">건강상 이유 (질병 치료)</option>
                  </>
                )}
                {type === 'return' && (
                  <>
                    <option value="기간만료">휴학 기간 만료로 인한 복학</option>
                    <option value="귀국">해외 연수 종료</option>
                    <option value="전역">군 전역 (제대 복학)</option>
                  </>
                )}
                {type === 'dropout' && (
                  <>
                    <option value="타대진학">타 대학 입학</option>
                    <option value="진로변경">진로 변경 및 취업</option>
                    <option value="학업포기">개인사정으로 인한 학업 포기</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">상세 사유 기술</label>
              <textarea 
                placeholder="상세 내용을 입력하세요."
                value={formData.detailedReason}
                onChange={(e) => setFormData({...formData, detailedReason: e.target.value})}
                className="w-full h-20 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {step < 2 && (
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700/50 active:scale-95 transition-all"
              >
                지도교수 정보 확인
              </button>
            )}
            <button 
              type="submit" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-lg shadow-amber-500/10"
            >
              신청서 임시저장 및 제출
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 text-center mb-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">신청서 접수 완료</h4>
            <p className="text-xs text-slate-400 mt-1.5">
              원서가 정상적으로 임시저장되었습니다.<br />
              지도교수({profile.advisor}) 면담 승인 후 대학 학적과로 자동 인계됩니다.
            </p>
          </div>
          <div className="text-[11px] bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-slate-300 inline-block text-left w-full max-w-sm space-y-1">
            <div><span className="text-slate-500">· 신청유형:</span> {getTitle().split(' ')[0]}</div>
            <div><span className="text-slate-500">· 제출일자:</span> {new Date().toLocaleDateString()}</div>
            <div><span className="text-slate-500">· 사유구분:</span> {formData.reason}</div>
            {type === 'leave' && <div><span className="text-slate-500">· 신청기간:</span> {formData.period}</div>}
          </div>
          <button 
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="text-xs font-semibold text-amber-400 hover:underline block mx-auto"
          >
            새로 작성하기
          </button>
        </div>
      )}

      {/* Academic change history list */}
      {records && records.length > 0 && (
        <div className="border-t border-slate-800/80 pt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">과거 학적 변동 내역</h4>
          <div className="space-y-2">
            {records.map((rec, index) => (
              <div 
                key={index} 
                className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    rec.type === 'leave' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{rec.details}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">신청일: {rec.requestDate}</div>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    rec.status === '승인' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
