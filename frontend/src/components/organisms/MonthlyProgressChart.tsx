'use client'; 

import { useDashboardStore } from '@/store/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MonthlyProgressChart = () => {
  const data = useDashboardStore((state) => state.getMonthlyProgress());
  
  const projectColors = {
    'TaskFlow MVP': '#000000',    // Preto
    'Onboarding': '#10B981',      // Verde
    'Documentação': '#EF4444',    // Vermelho
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Progresso Mensal de Projetos</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
            
            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
            />
            
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
            
            <Bar dataKey="TaskFlow MVP" fill={projectColors['TaskFlow MVP']} />
            <Bar dataKey="Onboarding" fill={projectColors['Onboarding']} />
            <Bar dataKey="Documentação" fill={projectColors['Documentação']} />
            
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};