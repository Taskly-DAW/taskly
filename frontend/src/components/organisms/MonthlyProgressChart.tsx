'use client';

import {
  aggregateMonthlyProgress,
  useDashboardStore,
} from '@/store/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useShallow } from 'zustand/shallow';
import React from 'react';
import { DashboardState } from '@/types/dashboard';

const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
};

export const MonthlyProgressChart = ({ tasks, filters, projects }: DashboardState) => {
  const data = React.useMemo(() => {
    return aggregateMonthlyProgress(tasks, projects);
  }, [tasks, projects]);

  const projectsToDisplay = React.useMemo(() => {
    const allProjectNames = projects?.map((p) => p.name);
    if (filters?.projects?.includes('Todos os Projetos') || !filters?.projects) {
      return allProjectNames;
    }
    return filters.projects.filter((p) => p !== 'Todos os Projetos');
  }, [filters?.projects, projects]);

  console.log(tasks);
  console.log(projects);
  console.log(data);
  

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Progresso Mensal de Projetos
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            barCategoryGap="15%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="name"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />

            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
              }}
            />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '10px' }}
            />

            {projectsToDisplay?.map((projectName) => (
              <Bar
                key={projectName}
                dataKey={projectName}
                fill={generateColorFromString(projectName)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
