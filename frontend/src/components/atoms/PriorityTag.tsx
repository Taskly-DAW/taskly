import { Priority } from '@/types/tasks';

const COLORS: Record<Priority, string> = {
  Alta: 'bg-red-100 text-red-700',
  Média: 'bg-green-100 text-green-700',
  Baixa: 'bg-gray-200 text-gray-700',
};

interface PriorityTagProps {
  priority: Priority;
}

export default function PriorityTag({ priority }: PriorityTagProps) {
  return (
    <span
      className={`px-3 py-1 rounded-full font-semibold text-xs ${COLORS[priority]}`}
    >
      {priority}
    </span>
  );
}
