'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TimetableCard from '@/components/cards/TimetableCard';
import ProfessorScheduleCard from '@/components/cards/ProfessorScheduleCard';
import { timetableData, professorDirectory } from '@/data/mockData';

function TimetableContent() {
  const searchParams = useSearchParams();
  const [isProfessorView, setIsProfessorView] = useState(false);

  useEffect(() => {
    setIsProfessorView(searchParams.get('type') === 'professor');
  }, [searchParams]);

  if (isProfessorView) {
    return <ProfessorScheduleCard directory={professorDirectory} schedule={timetableData} />;
  }

  return <TimetableCard data={timetableData} />;
}

export default function TimetablePage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <Suspense fallback={<div className="text-slate-550 text-xs font-bold p-4 text-center">로딩 중...</div>}>
        <TimetableContent />
      </Suspense>
    </div>
  );
}
