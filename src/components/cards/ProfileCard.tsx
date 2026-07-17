'use client';

import React from 'react';
import { User, Award, BookOpen, Calendar, Mail, Phone, Shield } from 'lucide-react';
import { StudentProfile } from '@/data/mockData';

interface ProfileCardProps {
  data: StudentProfile;
}

export default function ProfileCard({ data }: ProfileCardProps) {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Avatar Area */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg relative group">
          <User className="w-12 h-12 text-white/95" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-slate-900">
            {data.status}
          </div>
        </div>

        {/* Core Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
            {data.name}
            <span className="text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
              학번: {data.studentId}
            </span>
          </h2>
          <p className="text-slate-400 font-medium mb-3">
            {data.major} · {data.grade}학년 {data.semester}학기
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>{data.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Profile Section */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">지도교수</div>
            <div className="text-sm font-semibold text-white">{data.advisor} 교수</div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">소속 학과사무실</div>
            <div className="text-sm font-semibold text-white">공학관 2층 204호 (내선 1024)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
