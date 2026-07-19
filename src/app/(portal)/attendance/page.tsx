'use client';

import AttendanceCard from '@/components/cards/AttendanceCard';
import { officialLeaves } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

export default function AttendancePage() {
  const { studentData } = useAuth();
  return (
    <div className="max-w-5xl w-full mx-auto">
      <AttendanceCard data={{ attendance: studentData.attendance, officialLeaves }} />
    </div>
  );
}
