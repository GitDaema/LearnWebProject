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
    if (n.includes('메일')) return <Mail className="w-5 h-5 text-sky-400" />;
    if (n.includes('수강')) return <BookOpen className="w-5 h-5 text-emerald-400" />;
    if (n.includes('증명') || n.includes('발급')) return <FileText className="w-5 h-5 text-purple-400" />;
    if (n.includes('비밀번호') || n.includes('pw')) return <Key className="w-5 h-5 text-amber-400" />;
    if (n.includes('bbs') || n.includes('게시판')) return <MessageSquare className="w-5 h-5 text-rose-400" />;
    if (n.includes('llm') || n.includes('ai')) return <Bot className="w-5 h-5 text-indigo-400" />;
    return <LinkIcon className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-5 pb-5 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-400" />
          포털 연동 및 외부 서비스
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm">학내 종합 행정, 증명서 출력 및 커뮤니티 등의 연결 서비스 바로가기입니다.</p>
      </div>

      {/* Links Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-850/50 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/30 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200 shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {getLinkIcon(link.name)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                  {link.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {link.description}
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800/60 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all flex-shrink-0">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
