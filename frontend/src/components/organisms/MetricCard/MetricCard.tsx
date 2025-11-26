import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricValue } from '@/components/molecules/MetricValue';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  percentage: number;
  icon: LucideIcon;
  iconColorClass: string;
}

export const MetricCard = ({
  title,
  value,
  percentage,
  icon: Icon,
  iconColorClass,
}: MetricCardProps) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-transparent hover:border-t-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4', iconColorClass)} />
      </CardHeader>

      <CardContent>
        <MetricValue value={value} percentage={percentage} />
      </CardContent>
    </Card>
  );
};
