'use client';

import ProfileCard from '@/components/cards/ProfileCard';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { studentData } = useAuth();
  return (
    <div className="max-w-4xl w-full mx-auto">
      <ProfileCard data={studentData.profile} />
    </div>
  );
}
