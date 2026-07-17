import TimetableCard from '@/components/cards/TimetableCard';
import { timetableData } from '@/data/mockData';

export default function TimetablePage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <TimetableCard data={timetableData} />
    </div>
  );
}
