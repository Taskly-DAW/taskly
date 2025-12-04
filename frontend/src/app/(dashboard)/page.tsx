'use client';

import { CheckCircle, Clock, XCircle, Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/organisms/MetricCard';
import { MonthlyProgressChart } from '@/components/organisms/MonthlyProgressChart';
import { StatusDistributionChart } from '@/components/organisms/StatusDistributionChart';
import { QuickFilters } from '@/components/organisms/QuickFilters';
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/shallow';
import { useEffect, useMemo } from 'react';

export default function DashboardPage() {
  const { tasks, fetchTasks, isLoading } = useDashboardStore(
    useShallow((state) => ({
      tasks: state.tasks,
      fetchTasks: state.fetchTasks,
      isLoading: state.isLoading,
    })),
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const metrics = useMemo(() => {
    const total = tasks.length;

    console.log(tasks);
    
    const completed = tasks.filter((t) => t.status === 'Concluído').length;
    const inProgress = tasks.filter((t) => t.status === 'Em Progresso').length;

    const now = new Date();
    const overdue = tasks.filter((t) => {
      const isDone = t.status === 'done';
      return !isDone && new Date(t.dueDate) < now;
    }).length;

    return [
      {
        title: 'Tarefas Concluídas',
        value: completed,
        percentage: 0,
        icon: CheckCircle,
        iconColorClass: 'text-blue-600',
        isInverter: false,
      },
      {
        title: 'Tarefas em Andamento',
        value: inProgress,
        percentage: 0,
        icon: Clock,
        iconColorClass: 'text-orange-500',
        isInverter: false,
      },
      {
        title: 'Tarefas Atrasadas',
        value: overdue,
        percentage: 0,
        icon: XCircle,
        iconColorClass: 'text-red-600',
        isInverter: true,
      },
    ];
  }, [tasks]);

  if (isLoading) {
    return <div className="p-6">Carregando dados...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo(a) ao Taskly!
        </h1>

        <div className="flex gap-3">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Nova Tarefa
          </Button>
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" /> Criar Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <StatusDistributionChart />
        </div>

        <div className="lg:col-span-5">
          <MonthlyProgressChart />
        </div>

        <div className="lg:col-span-3">
          <QuickFilters />
        </div>
      </div>
    </div>
  );
}
