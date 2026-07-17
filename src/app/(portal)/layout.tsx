'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Menu, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { studentProfile } from '@/data/mockData';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'AI Prompt Portal', subtitle: '자연어로 대화하는 지능형 학사 안내원' },
  '/profile': { title: '개인정보관리', subtitle: '내 인적사항 및 지도교수 정보 확인' },
  '/academic': { title: '학적관리', subtitle: '휴학·복학·자퇴 신청 및 이력 조회' },
  '/timetable': { title: '시간표관리', subtitle: '나의 주간 시간표 및 강의실 정보' },
  '/syllabus': { title: '수업관리', subtitle: '교과목별 강의계획서 상세 안내' },
  '/attendance': { title: '전자출결관리', subtitle: '출결 현황 및 공결 신청 내역' },
  '/grades': { title: '성적관리', subtitle: '학기별 성적 단표 및 평점 평균' },
  '/tuition': { title: '등록관리', subtitle: '등록금 고지서 및 환불 신청 내역' },
  '/links': { title: '외부 연동 서비스', subtitle: '교내 주요 서비스 바로가기' },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const meta = PAGE_META[pathname] ?? PAGE_META['/'];

  const hasKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const apiKeyWarning = isHome && (!hasKey || hasKey === 'your_api_key_here');

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      <main className="flex-1 md:pl-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-slate-950/40 backdrop-blur-md border-b border-slate-800/60 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                {isHome && <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />}
                {meta.title}
              </h2>
              <p className="text-[10px] text-slate-400">{meta.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {apiKeyWarning && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                로컬 데모 모드 (Fallback)
              </span>
            )}
            <div className="text-xs bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              학번: <span className="font-bold text-white">{studentProfile.studentId}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full px-4 sm:px-6 py-6 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
