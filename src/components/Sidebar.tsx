'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, FileText, Calendar, BookOpen, Monitor, BarChart3, CreditCard, 
  Globe, Mail, Bot, MessageSquare, ChevronDown, ExternalLink, X, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SubMenuItem {
  label: string;
  path?: string;
  href?: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string; // 서브메뉴가 없는 경우 다이렉트 링크용
  type?: 'accordion' | 'external';
  subItems?: SubMenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'MYPAGE',
    items: [
      {
        label: '개인정보관리',
        icon: <User className="w-4 h-4" />,
        subItems: [
          { label: '비밀번호변경(링크)', href: 'https://wis.univ.ac.kr/change-pw' }
        ]
      }
    ]
  },
  {
    title: '정보서비스',
    items: [
      {
        label: '학적관리',
        icon: <FileText className="w-4 h-4" />,
        subItems: [
          { label: '휴복학신청', path: '/academic?type=leave' },
          { label: '자퇴신청', path: '/academic?type=dropout' }
        ]
      },
      {
        label: '시간표관리',
        icon: <Calendar className="w-4 h-4" />,
        subItems: [
          { label: '학과별시간표', path: '/timetable' },
          { label: '교수시간표조회', path: '/timetable?type=professor' }
        ]
      },
      {
        label: '수업관리',
        icon: <BookOpen className="w-4 h-4" />,
        subItems: [
          { label: '강의계획서조회', path: '/syllabus' },
          { label: '수강신청관리(링크)', href: 'https://sugang.univ.ac.kr' },
          { label: '수강신청조회', path: '/syllabus?view=enrollment' },
          { label: '수업평가실시', path: '/syllabus?view=evaluation' }
        ]
      },
      {
        label: '전자출결관리',
        icon: <Monitor className="w-4 h-4" />,
        subItems: [
          { label: '출결조회', path: '/attendance' },
          { label: '공결신청', path: '/attendance' },
          { label: '공결조회', path: '/attendance' }
        ]
      },
      {
        label: '성적관리',
        icon: <BarChart3 className="w-4 h-4" />,
        subItems: [
          { label: '성적단표내역조회', path: '/grades' },
          { label: '이수과목확인리스트', path: '/grades?view=completed' },
          { label: '전체성적조회', path: '/grades?view=all' }
        ]
      },
      {
        label: '등록관리',
        icon: <CreditCard className="w-4 h-4" />,
        subItems: [
          { label: '등록고지서', path: '/tuition?tab=invoice' },
          { label: '[환불] 신청 및 내역', path: '/tuition?tab=refund' }
        ]
      }
    ]
  },
  {
    title: '증명발급',
    items: [
      { label: '인터넷발급', icon: <Globe className="w-4 h-4" />, href: 'https://cert.univ.ac.kr', type: 'external' },
      { label: '우편발급', icon: <Mail className="w-4 h-4" />, href: 'https://post-cert.univ.ac.kr', type: 'external' }
    ]
  },
  {
    title: '연결 서비스',
    items: [
      { label: '웹메일', icon: <Mail className="w-4 h-4" />, href: 'https://mail.univ.ac.kr', type: 'external' },
      { label: '웹정보서비스', icon: <Globe className="w-4 h-4" />, href: 'https://wis.univ.ac.kr', type: 'external' },
      { label: 'LLM 서비스', icon: <Bot className="w-4 h-4" />, href: 'https://ai.univ.ac.kr', type: 'external' },
      { label: '봉황BBS', icon: <MessageSquare className="w-4 h-4" />, href: 'https://bbs.univ.ac.kr', type: 'external' }
    ]
  }
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { studentData, logout } = useAuth();
  const { profile } = studentData;
  const router = useRouter();
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleMenuClick = (label: string) => {
    setOpenAccordion(prev => prev === label ? null : label);
  };

  const handleDirectClick = (item: MenuItem) => {
    // 아무것도 하지 않음 (외부 링크 비활성화)
    onClose();
  };

  const handleSubItemClick = (label: string, path?: string, href?: string) => {
    if (href) {
      // 아무것도 하지 않음 (외부 링크 비활성화)
      return;
    }
    if (path) {
      onClose(); // 모바일 환경 대응을 위해 닫기
      router.push(path);
    }
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0a1120] border-r border-[#1e293b]/50 p-5 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo & Close Button for Mobile */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <Link 
            href="/" 
            onClick={(e) => {
              onClose();
              if (window.location.pathname === '/') {
                e.preventDefault();
                const event = new CustomEvent('reset-chat');
                window.dispatchEvent(event);
              }
            }} 
            className="flex items-center gap-3"
          >
            {/* 원광대 로고 심볼 마크 (wku-logo.png 반영) */}
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center flex-shrink-0">
              <img 
                src="/wku-logo.png" 
                alt="WKU Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-white tracking-wide leading-tight">원광대학교</h1>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider font-sans uppercase">Wonkwang University</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Menu Trees - scrollbar-gutter 설정으로 Layout Shift 방지 */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 scrollbar-thin scrollbar-thumb-slate-800 [scrollbar-gutter:stable]">
          {MENU_GROUPS.map((group) => (
            <div key={group.title}>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest block mb-2 px-1 uppercase">{group.title}</span>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isOpen = openAccordion === item.label;

                  return (
                    <li key={item.label} className="flex flex-col">
                      {hasSubItems ? (
                        /* 아코디언 형태의 2뎁스 버튼 */
                        <button
                          onClick={() => handleMenuClick(item.label)}
                          className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                            isOpen 
                              ? 'text-white bg-[#1e293b]/70 border border-[#334155]/30' 
                              : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`${isOpen ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      ) : (
                        /* 다이렉트 클릭 2뎁스 링크 */
                        <button
                          onClick={() => handleDirectClick(item)}
                          className="w-full text-left text-xs font-semibold px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer text-slate-400 hover:text-white hover:bg-[#1e293b]/30"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </button>
                      )}

                      {/* 3뎁스 서브 메뉴 목록 (슬라이드 애니메이션 적용) */}
                      {hasSubItems && (
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out pl-6.5 ${
                            isOpen ? 'max-h-60 mt-1 mb-1.5 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="space-y-0.5 border-l border-slate-800/80 pl-3">
                            {item.subItems!.map((sub) => (
                              <li key={sub.label}>
                                <button
                                  onClick={() => handleSubItemClick(sub.label, sub.path, sub.href)}
                                  className="w-full text-left text-[11px] font-medium text-slate-400 hover:text-indigo-400 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between group/sub"
                                >
                                  <span>{sub.label}</span>
                                  {sub.href && <ExternalLink className="w-2.5 h-2.5 text-slate-600 group-hover/sub:text-indigo-400/80" />}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* User Mini Profile Footer - Figma 스타일의 둥근 밝은색 카드 형태 */}
      <div className="mt-4 flex-shrink-0 bg-[#f1f3f9] border border-[#e2e8f0]/40 p-3 rounded-2xl flex items-center justify-between shadow-sm">
        <Link 
          href="/profile" 
          onClick={onClose} 
          className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
        >
          {/* 파란색 둥근 아바타 */}
          <div className="w-9 h-9 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
            {profile.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{profile.name}</div>
            <div className="text-[9px] text-slate-500 mt-0.5 leading-normal truncate">
              학부: {profile.major}
              <br />
              학번: {profile.studentId}
            </div>
          </div>
        </Link>
        {/* 로그아웃 버튼 */}
        <button
          onClick={logout}
          title="로그아웃"
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-200/50 transition-all cursor-pointer flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
