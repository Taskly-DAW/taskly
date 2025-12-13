'use client';

import React from 'react';
import {
  useDashboardStore,
  aggregateStatusDistribution,
} from '@/store/dashboardStore';
import { useShallow } from 'zustand/react/shallow';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg text-sm text-gray-700">
        <p className="font-semibold">{data.name}</p>
        <p>
          Tarefas: <span className="font-bold">{data.value}</span>
        </p>{' '}
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm pt-4">
      {payload.map((entry: any, index: number) => {
        const finalName = entry.name || entry.value;
        return (
          <div
            key={`item-${index}`}
            className="flex items-center cursor-pointer"
          >
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{finalName}</span>
          </div>
        );
      })}
    </div>
  );
};

export const StatusDistributionChart = () => {
  const { tasks } = useDashboardStore(
    useShallow((state) => ({
      tasks: state.tasks,
    })),
  );

  const data = React.useMemo(() => {
    return aggregateStatusDistribution(tasks);
  }, [tasks]);

  const hasData = data.some((item) => item.value > 0);

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Distribuição de Status de Tarefas
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 flex flex-col items-center">
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <CustomLegend
              payload={data.map((d) => ({
                name: d.name,
                color: d.color,
                value: d.value,
              }))}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Nenhuma tarefa para distribuir.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
