import { getMonthLabel } from '@/lib/utils/dateUtils';
import {
  MonthlyProgressData,
  StatusDistributionData,
} from '@/schemas/chartSchema'; // Adicionado StatusDistributionData
import { create, StateCreator } from 'zustand';
import { Task } from '@/schemas/taskSchema'; // Importar o tipo Task
import { MOCK_TASKS } from '@/lib/mockData'; // <-- Importar o mock
import { DashboardFilters, DashboardState } from '@/types/dashboard';

const STATUS_COLORS = {
  'Concluídas': '#1D4ED8',
  'Em Andamento': '#4CAF50',
  'Atrasadas': '#EF4444',
  'A Fazer': '#FFDE21',
};

export const aggregateStatusDistribution = (
  tasks: Task[],
): StatusDistributionData[] => {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      const status = task.status as keyof typeof STATUS_COLORS;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<keyof typeof STATUS_COLORS, number>,
  );

  return Object.keys(statusCounts)
    .map((status) => ({
      name: status as keyof typeof STATUS_COLORS,
      value: statusCounts[status as keyof typeof STATUS_COLORS],
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
    }))
    .filter((item) => item.value > 0);
};

export const aggregateMonthlyProgress = (
  tasks: Task[],
  filters: DashboardFilters,
): MonthlyProgressData[] => {
  // Nota: tasks e filters agora estão tipados.
  const monthlyData: { [key: string]: { [project: string]: number } } = {};
  const MOCK_PROJECTS = ['TaskFlow MVP', 'Onboarding', 'Documentação']; // Hardcoded projects

  // 1. Aplicar filtro básico (ex: filtro de período, se fosse implementado)
  const filteredTasks = tasks.filter((task) => {
    // Exemplo de filtro:
    // return filters.status === 'Todos' || task.status === filters.status;
    return true;
  });

  // 2. Agregação
  filteredTasks.forEach((task) => {
    const month = getMonthLabel(task.dueDate);
    const project = task.projectName || 'Desconhecido'; // Assegure que projectName exista

    if (!monthlyData[month]) {
      // Inicializa todos os projetos do mês para 0
      monthlyData[month] = MOCK_PROJECTS.reduce(
        (acc, p) => ({ ...acc, [p]: 0 }),
        {},
      );
    }

    if (monthlyData[month][project] !== undefined) {
      monthlyData[month][project] += 1;
    }
  });

  // 3. Conversão para Array
  return Object.keys(monthlyData).map((month) => ({
    name: month,
    ...monthlyData[month],
  }));
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  tasks: MOCK_TASKS,
  filters: {
    // Inicialmente, apenas o rótulo "Todos" é selecionado (como um array de 1 item)
    project: ['Todos os Projetos'], 
    status: ['Todos os Status'],
    responsible: ['Todos os Responsáveis'],
    period: 'Últimos 7 Dias', // Mantém single-select
  },

  setFilter: (key, value) => {
    // Se for 'period', trata como string. Para outros, sempre um array.
    const newValue = key === 'period' ? value : (Array.isArray(value) ? value : [value]);
    set((state) => ({
        filters: { ...state.filters, [key]: newValue },
    }));
  },

  getMonthlyProgress: () => {
    const { tasks, filters } = get();
    return aggregateMonthlyProgress(tasks, filters);
  },

  getStatusDistribution: () => {
    const { tasks } = get();
    return aggregateStatusDistribution(tasks);
  },
}));
