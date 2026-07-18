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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedCode === s.code
                ? 'bg-emerald-55 text-emerald-600 border-emerald-205 shadow-sm'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100'
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
