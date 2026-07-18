'use client';

import React, { Suspense } from 'react';
import TuitionCard from '@/components/cards/TuitionCard';
import { currentTuition, refundRecords } from '@/data/mockData';

export default function TuitionPage() {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <Suspense fallback={<div className="text-slate-555 text-xs font-bold p-4 text-center">로딩 중...</div>}>
        <TuitionCard data={{ invoice: currentTuition, refunds: refundRecords }} />
      </Suspense>
    </div>
  );
}
