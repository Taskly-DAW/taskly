import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ChartSwitcher from '@/components/molecules/ChartSwitcher';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart as LineChartRechart,
  Line,
  PieChart as PieChartRechart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function TasksChart({
  chartType,
  setChartType,
  chartData,
}: any) {
  return (
    <Card className="mb-10 shadow-sm">
      <CardHeader className="flex justify-between">
        <CardTitle>Visão Geral do Status das Tarefas</CardTitle>
        <ChartSwitcher chartType={chartType} setChartType={setChartType} />
      </CardHeader>

      <CardContent className="h-80">
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((item: any, index: number) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChartRechart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" stroke="#1E88E5" strokeWidth={3} />
            </LineChartRechart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer>
            <PieChartRechart>
              <Pie data={chartData} dataKey="value" outerRadius={100} label>
                {chartData.map((item: any, index: number) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
            </PieChartRechart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
