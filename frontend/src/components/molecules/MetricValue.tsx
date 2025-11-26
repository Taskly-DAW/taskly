import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricValueProps {
  value: number;
  percentage: number;
}

export const MetricValue = ({ value, percentage }: MetricValueProps) => {
  const isPositive = percentage >= 0;
  const percentageDisplay = `${isPositive ? '+' : ''}${percentage.toFixed(1)}% do mês passado`;
  
  const percentageColor = isPositive 
    ? "text-green-600 dark:text-green-400" 
    : "text-red-600 dark:text-red-400";
  
  return (
    <div className="flex flex-col">
      
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
        {value.toLocaleString('pt-BR')}
      </div>

      <div className={cn("flex items-center text-sm font-medium", percentageColor)}>
        {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        <span>{percentageDisplay}</span>
      </div>
    </div>
  );
};