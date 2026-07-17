'use client';

import React, { useState } from 'react';
import SyllabusCard from '@/components/cards/SyllabusCard';
import { syllabusData } from '@/data/mockData';

export default function SyllabusPage() {
  const [selectedCode, setSelectedCode] = useState(syllabusData[0].code);
  const selected = syllabusData.find(s => s.code === selectedCode) ?? syllabusData[0];

  return (
    <div className="max-w-5xl w-full mx-auto space-y-4">
      <div className="flex flex-wrap gap-2">
        {syllabusData.map((s) => (
          <button
            key={s.code}
            onClick={() => setSelectedCode(s.code)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              selectedCode === s.code
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {s.subject}
          </button>
        ))}
      </div>
      <SyllabusCard data={selected} />
    </div>
  );
}
