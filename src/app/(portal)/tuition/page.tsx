import TuitionCard from '@/components/cards/TuitionCard';
import { currentTuition, refundRecords } from '@/data/mockData';

export default function TuitionPage() {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <TuitionCard data={{ invoice: currentTuition, refunds: refundRecords }} />
    </div>
  );
}
