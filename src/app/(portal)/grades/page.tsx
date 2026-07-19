'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GradeCard from '@/components/cards/GradeCard';
import GraduationRequirementCard from '@/components/cards/GraduationRequirementCard';
import { useAuth } from '@/context/AuthContext';
import { graduationRequirement } from '@/data/mockData';

type GradesView = 'recent' | 'all' | 'completed';

function GradesContent() {
  const { studentData } = useAuth();
  const searchParams = useSearchParams();
  const [view, setView] = useState<GradesView>('recent');

  useEffect(() => {
    const viewParam = searchParams.get('view');
    setView(viewParam === 'all' || viewParam === 'completed' ? viewParam : 'recent');
  }, [searchParams]);

  if (view === 'all') {
    return <GradeCard data={studentData.grades} />;
  }

  if (view === 'completed') {
    return <GraduationRequirementCard grades={studentData.grades} requirement={graduationRequirement} />;
  }

  return <GradeCard data={studentData.grades[studentData.grades.length - 1]} />;
}

export default function GradesPage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <Suspense fallback={<div className="text-slate-550 text-xs font-bold p-4 text-center">로딩 중...</div>}>
        <GradesContent />
      </Suspense>
    </div>
  );
}
