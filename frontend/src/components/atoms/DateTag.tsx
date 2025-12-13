import { Calendar } from 'lucide-react';

interface DateTagProps {
  date: string;
}

export default function DateTag({ date }: DateTagProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <Calendar size={16} />
      <span className="font-medium">{date}</span>
    </div>
  );
}
