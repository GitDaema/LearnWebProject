'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AcademicCard from '@/components/cards/AcademicCard';
import { useAuth } from '@/context/AuthContext';
import { academicRecords } from '@/data/mockData';

const TYPE_LABELS: Record<'leave' | 'return' | 'dropout', string> = {
  leave: '휴학',
  return: '복학',
  dropout: '자퇴',
};

function AcademicContent() {
  const { studentData } = useAuth();
  const searchParams = useSearchParams();
  const [type, setType] = useState<'leave' | 'return' | 'dropout'>('leave');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['leave', 'return', 'dropout'].includes(typeParam)) {
      setType(typeParam as 'leave' | 'return' | 'dropout');
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as Array<'leave' | 'return' | 'dropout'>).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              type === t
                ? 'bg-amber-55 text-amber-600 border-amber-205 shadow-sm'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100'
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
          profile: studentData.profile,
        }}
      />
    </div>
  );
}

export default function AcademicPage() {
  return (
    <Suspense fallback={<div className="text-slate-550 text-xs font-bold p-4 text-center">로딩 중...</div>}>
      <AcademicContent />
    </Suspense>
  );
}
