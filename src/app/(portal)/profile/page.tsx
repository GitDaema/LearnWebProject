import ProfileCard from '@/components/cards/ProfileCard';
import { studentProfile } from '@/data/mockData';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <ProfileCard data={studentProfile} />
    </div>
  );
}
