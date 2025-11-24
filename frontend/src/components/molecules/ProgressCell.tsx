import { Progress } from '@/components/ui/progress';

interface ProgressCellProps {
  progress: number;
}

export const ProgressCell = ({ progress }: ProgressCellProps) => {
  return (
    <div className="flex items-center gap-3 w-40">
      <div className="flex-1">
        <Progress value={progress} className="h-2" />
      </div>
      <span className="text-sm font-medium w-8 text-right">{progress}%</span>
    </div>
  );
};