import AttendanceCard from '@/components/cards/AttendanceCard';
import { attendanceData, officialLeaves } from '@/data/mockData';

export default function AttendancePage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <AttendanceCard data={{ attendance: attendanceData, officialLeaves }} />
    </div>
  );
}
