'use client';

import React from 'react';
import { ExternalLink as LinkIcon, Mail, BookOpen, FileText, Key, MessageSquare, Bot, ArrowUpRight } from 'lucide-react';
import { ExternalLink } from '@/data/mockData';

interface LinkCardProps {
  data: ExternalLink[] | ExternalLink;
}

export default function LinkCard({ data }: LinkCardProps) {
  const isArray = Array.isArray(data);
  const links = isArray ? data : [data];

  const getLinkIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('메일')) return <Mail className="w-5 h-5 text-sky-500" />;
    if (n.includes('수강')) return <BookOpen className="w-5 h-5 text-emerald-600" />;
    if (n.includes('증명') || n.includes('발급')) return <FileText className="w-5 h-5 text-purple-600" />;
    if (n.includes('비밀번호') || n.includes('pw')) return <Key className="w-5 h-5 text-amber-650" />;
    if (n.includes('bbs') || n.includes('게시판')) return <MessageSquare className="w-5 h-5 text-rose-605" />;
    if (n.includes('llm') || n.includes('ai')) return <Bot className="w-5 h-5 text-indigo-600" />;
    return <LinkIcon className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-500" />
          포털 연동 및 외부 서비스
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm">학내 종합 행정, 증명서 출력 및 커뮤니티 등의 연결 서비스 바로가기입니다.</p>
      </div>

      {/* Links Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <div
            key={link.name}
            className="group bg-slate-50 hover:bg-slate-100/50 border border-slate-200/40 hover:border-indigo-300 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                {getLinkIcon(link.name)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-650 transition-colors truncate">
                  {link.name}
                </div>
                <div className="text-[11px] text-slate-450 truncate mt-0.5">
                  {link.description}
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all flex-shrink-0">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
