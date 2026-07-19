'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SyllabusCard from '@/components/cards/SyllabusCard';
import EnrollmentSummaryCard from '@/components/cards/EnrollmentSummaryCard';
import CourseEvaluationCard from '@/components/cards/CourseEvaluationCard';
import { syllabusData, courseRegistrations, enrollmentCreditLimit } from '@/data/mockData';

type SyllabusView = 'plan' | 'enrollment' | 'evaluation';

function SyllabusContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<SyllabusView>('plan');

  useEffect(() => {
    const viewParam = searchParams.get('view');
    setView(viewParam === 'enrollment' || viewParam === 'evaluation' ? viewParam : 'plan');
  }, [searchParams]);

  const [selectedCode, setSelectedCode] = useState(syllabusData[0].code);
  const selected = syllabusData.find(s => s.code === selectedCode) ?? syllabusData[0];

  if (view === 'enrollment') {
    return <EnrollmentSummaryCard registrations={courseRegistrations} creditLimit={enrollmentCreditLimit} />;
  }

  if (view === 'evaluation') {
    return <CourseEvaluationCard data={courseRegistrations} />;
  }

  return (
    <div className="space-y-4">
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

export default function SyllabusPage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <Suspense fallback={<div className="text-slate-550 text-xs font-bold p-4 text-center">로딩 중...</div>}>
        <SyllabusContent />
      </Suspense>
    </div>
  );
}
