'use client';

import React, { useState } from 'react';
import AcademicCard from '@/components/cards/AcademicCard';
import { academicRecords, studentProfile } from '@/data/mockData';

const TYPE_LABELS: Record<'leave' | 'return' | 'dropout', string> = {
  leave: '휴학',
  return: '복학',
  dropout: '자퇴',
};

export default function AcademicPage() {
  const [type, setType] = useState<'leave' | 'return' | 'dropout'>('leave');

  return (
    <div className="max-w-4xl w-full mx-auto space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as Array<'leave' | 'return' | 'dropout'>).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              type === t
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {TYPE_LABELS[t]} 신청
          </button>
        ))}
      </div>
      <AcademicCard
        data={{
          type,
          records: academicRecords.filter(r => r.type === type),
          profile: studentProfile,
        }}
      />
    </div>
  );
}
