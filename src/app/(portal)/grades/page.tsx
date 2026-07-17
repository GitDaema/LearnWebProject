import GradeCard from '@/components/cards/GradeCard';
import { gradeHistory } from '@/data/mockData';

export default function GradesPage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <GradeCard data={gradeHistory} />
    </div>
  );
}
