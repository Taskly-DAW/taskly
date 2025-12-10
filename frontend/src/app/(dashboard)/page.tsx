'use client';

import { CheckCircle, Clock, XCircle, Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/organisms/MetricCard';
import { MonthlyProgressChart } from '@/components/organisms/MonthlyProgressChart';
import { StatusDistributionChart } from '@/components/organisms/StatusDistributionChart';
import { QuickFilters } from '@/components/organisms/QuickFilters';
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/shallow';
import { useEffect, useMemo, useState } from 'react';
import { Task } from '@/schemas/taskSchema';

export default function DashboardPage() {
  const [taskFiltered, setTaskFiltered]: any = useState([]);

  const {
    fetchTasks,
    getFilteredTasks,
    fetchProjects,
    isLoading,
    projects,
    tasks,
    filters,
  } = useDashboardStore(
    useShallow((state) => ({
      fetchTasks: state.fetchTasks,
      fetchProjects: state.fetchProjects,
      getFilteredTasks: state.getFilteredTasks,
      filters: state.filters,
      projects: state.projects,
      tasks: state.tasks,
    })),
  );

  useEffect(() => {
    const load = async () => {
      await fetchProjects();
      await fetchTasks();
      setTaskFiltered(getFilteredTasks());
    };

    load();
  }, [filters]);

  const metrics = useMemo(() => {
    const total = taskFiltered.length;

    const completed = taskFiltered.filter(
      (t) => t.status === 'Concluído',
    ).length;
    const inProgress = taskFiltered.filter(
      (t) => t.status === 'Em Progresso',
    ).length;
    const todo = taskFiltered.filter((t) => t.status === 'A Fazer').length;

    const now = new Date();
    const overdue = taskFiltered.filter((t) => {
      const isDone = t.status === 'Concluído';
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
      ,
      {
        title: 'A Fazer',
        value: todo,
        percentage: 0,
        icon: Clock,
        iconColorClass: 'text-red-600',
        isInverter: true,
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
  }, [taskFiltered]);

  if (isLoading) {
    return <div className="p-6">Carregando dados...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo(a) ao Taskly!
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <StatusDistributionChart />
        </div>

        <div className="lg:col-span-5">
          <MonthlyProgressChart
            tasks={taskFiltered}
            filters={filters}
            projects={projects}
          />
        </div>

        <div className="lg:col-span-3">
          <QuickFilters />
        </div>
      </div>
    </div>
  );
}
