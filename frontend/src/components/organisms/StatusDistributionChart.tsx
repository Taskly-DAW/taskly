'use client';

import {
  aggregateStatusDistribution,
  useDashboardStore,
} from '@/store/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useShallow } from 'zustand/shallow';
import React from 'react';

export const StatusDistributionChart = () => {
  // Obter dados agregados e prontos para o gráfico
  const { tasks } = useDashboardStore(
    useShallow((state) => ({
      tasks: state.tasks,
      // Se houvesse algum filtro global que afetasse o gráfico, ele iria aqui
    })),
  );

  const data = React.useMemo(() => {
    // Chame a função de agregação, que agora deve estar acessível de alguma forma.
    // Exemplo: getStatusDistribution(tasks);
    // Para simplificar, vou supor que você exportou a função helper do store:
    return aggregateStatusDistribution(tasks);
  }, [tasks]); // O resultado 'data' só muda se 'tasks' mudar.

  // Componente Customizado para renderizar as fatias
  const CustomLegend = (props: any) => {
    const { payload } = props;
    console.log(payload);
    

    return (
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm pt-4">
        {payload.map((entry: any, index: number) => {
          // Garante que o nome da cor e o valor estejam disponíveis
          const finalName = entry.value || entry.name;
          return (
            <div
              key={`item-${index}`}
              className="flex items-center cursor-pointer"
            >
              {/* A bolinha de cor (pequeno e consistente) */}
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              {/* Rótulo da Legenda */}
              <span className="text-gray-700">{finalName}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Condição para evitar erro de renderização com dados vazios
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
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80} // Define o tamanho do "buraco" (Donut Chart)
                  outerRadius={110} // Define o tamanho externo
                  paddingAngle={2} // Pequeno espaço entre as fatias
                  fill="#8884d8"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color} // Cor da borda
                    />
                  ))}
                </Pie>
                {/* A legenda padrão é substituída pela customizada abaixo do PieChart */}
                {/* O legend dentro do PieChart é necessário para que a legenda customizada receba os dados */}
                <Legend content={<></>} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legenda customizada renderizada fora do PieChart para melhor controle de layout */}
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
            Nenhuma tarefa encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
