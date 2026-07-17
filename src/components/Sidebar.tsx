'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, GraduationCap, X } from 'lucide-react';
import { studentProfile } from '@/data/mockData';

interface MenuItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'My Page',
    items: [
      { href: '/profile', label: '개인정보관리 (비밀번호 변경)', icon: <User className="w-3.5 h-3.5" /> },
    ],
  },
  {
    title: '학사 서비스',
    items: [
      { href: '/academic', label: '학적관리: 휴복학/자퇴신청' },
      { href: '/timetable', label: '시간표관리: 나의 시간표' },
      { href: '/syllabus', label: '수업관리: 강의계획서조회' },
      { href: '/attendance', label: '전자출결관리: 출결 및 공결신청' },
      { href: '/grades', label: '성적관리: 성적단표/이수과목조회' },
      { href: '/tuition', label: '등록관리: 등록고지서/환불신청' },
    ],
  },
  {
    title: '외부 연동 서비스',
    items: [
      { href: '/links', label: '증명발급: 인터넷/우편 발급' },
      { href: '/links', label: '웹메일 서비스 바로가기' },
      { href: '/links', label: '봉황BBS (커뮤니티)' },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950/90 backdrop-blur-lg border-r border-slate-800/80 p-6 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* Logo & Close Button for Mobile — 홈(AI 채팅)으로 이동하는 유일한 진입점 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white leading-tight">봉황대학교</h1>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Web Info Service</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Menu Trees */}
        <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
          {MENU_GROUPS.map((group) => (
            <div key={group.title}>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-2.5">{group.title}</span>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                          active
                            ? 'text-indigo-400 bg-slate-900/70'
                            : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-900/50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* User Mini Profile Footer */}
      <Link href="/profile" onClick={onClose} className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 hover:border-indigo-500/30 transition-all">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-white truncate">{studentProfile.name}</div>
          <div className="text-[10px] text-slate-500 truncate">{studentProfile.major} · {studentProfile.grade}학년</div>
        </div>
      </Link>
    </aside>
  );
}
