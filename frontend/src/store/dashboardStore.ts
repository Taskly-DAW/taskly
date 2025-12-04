import { getMonthLabel } from '@/lib/utils/dateUtils';
import {
  MonthlyProgressData,
  StatusDistributionData,
} from '@/schemas/chartSchema';
import { create, StateCreator } from 'zustand';
import { Task, TaskApiSchema } from '@/schemas/taskSchema';
import { MOCK_TASKS } from '@/lib/mockData';
import { DashboardFilters, DashboardState } from '@/types/dashboard';
import z from 'zod';
import { ProjectApiSchema, Project, ProjectApi } from '@/schemas/projectSchema';

const STATUS_COLORS = {
  Concluído: '#1D4ED8',
  'Em Progresso': '#4CAF50',
  Bloqueadas: '#EF4444',
  'A Fazer': '#FFDE21',
};

const isWithinPeriod = (date: Date, period: string) => {
  if (period === 'all') return true;
  const now = new Date();
  const taskDate = new Date(date);

  const diffTime = Math.abs(now.getTime() - taskDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (period === '7d') return diffDays <= 7;
  if (period === '30d') return diffDays <= 30;
  if (period === '90d') return diffDays <= 90;
  return true;
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
  const monthlyData: { [key: string]: { [project: string]: number } } = {};
  const MOCK_PROJECTS = ['TaskFlow MVP', 'Onboarding', 'Documentação'];

  const filteredTasks = tasks.filter((task) => {
    return true;
  });

  filteredTasks.forEach((task) => {
    const month = getMonthLabel(task.dueDate);
    const project = task.projectName || 'Desconhecido';

    if (!monthlyData[month]) {
      monthlyData[month] = MOCK_PROJECTS.reduce(
        (acc, p) => ({ ...acc, [p]: 0 }),
        {},
      );
    }

    if (monthlyData[month][project] !== undefined) {
      monthlyData[month][project] += 1;
    }
  });

  return Object.keys(monthlyData).map((month) => ({
    name: month,
    ...monthlyData[month],
  }));
};

const mapStatus = (apiStatus: string, completed: boolean): string => {
  const map: Record<string, string> = {
    pending: 'A Fazer',
    block: 'Bloqueado',
    doing: 'Em Progresso',
    done: 'Concluído',
  };
  return map[apiStatus] || 'A Fazer';
};

const mapPriority = (prio: number): 'Alta' | 'Média' | 'Baixa' => {
  if (prio === 0) return 'Baixa';
  if (prio === 1) return 'Média';
  return 'Alta';
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  tasks: [],
  fetchTasks: async () => {
    try {
      const response = await fetch(
        'http://localhost:8002/tasks/?skip=0&limit=100',
      );
      if (!response.ok) throw new Error('Erro ao buscar tarefas');

      const rawData = await response.json();

      const apiTasks = z.array(TaskApiSchema).parse(rawData);

      const uiTasks: Task[] = apiTasks.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        status: mapStatus(t.status, t.completed),
        priority: mapPriority(t.priority),
        dueDate: new Date(t.created_at),
        responsible: {
          name: 'Usuário Padrão',
          initials: 'UP',
          avatarUrl: '',
        },
      }));

      set({ tasks: uiTasks });
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
    }
  },

  projects: [],
  fetchProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/projects/');

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const rawData = await response.json();
      const apiProjects = z.array(ProjectApiSchema).parse(rawData);
      const uiProjects: Project[] = apiProjects.map((apiProj) => ({
        id: apiProj.id.toString(),
        name: apiProj.name,
        description: apiProj.description || '',
        dueDate: new Date(apiProj.created_at),
        progress: Math.floor(Math.random() * 100),
        status: 'Ativos',
        responsible: {
          name: 'Admin',
          avatarUrl: '',
        },
      }));

      set({ projects: uiProjects, isLoading: false });
    } catch (error) {
      console.error('Falha ao buscar projetos:', error);
      set({
        error: 'Não foi possível carregar os projetos.',
        isLoading: false,
      });
    }
  },

  isLoading: false,
  error: null,

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus as any } : task,
      ),
    })),

  filters: {
    projects: ['Todos os Projetos'],
    status: ['Todos os Status'],
    responsible: ['Todos os Responsáveis'],
    period: 'Últimos 7 Dias',
  },
  getFilteredTasks: () => {
    const { tasks, filters } = get();

    return tasks.filter((task) => {
      const hasProjectFilter =
        filters.projects.length > 0 &&
        !filters.projects.includes('Todos os Projetos');
      if (
        hasProjectFilter &&
        !filters.projects.includes(task.projectId || '')
      ) {
        return false;
      }

      const hasStatusFilter =
        filters.status.length > 0 &&
        !filters.status.includes('Todos os Status');
      if (hasStatusFilter && !filters.status.includes(task.status)) {
        return false;
      }

      const hasRespFilter =
        filters.responsible.length > 0 &&
        !filters.responsible.includes('Todos os Responsáveis');
      if (
        hasRespFilter &&
        !filters.responsible.includes(task.responsible.name)
      ) {
        return false;
      }

      if (!isWithinPeriod(task.dueDate, filters.period)) {
        return false;
      }

      return true;
    });
  },

  setFilter: (key, value) => {
    const newValue =
      key === 'period' ? value : Array.isArray(value) ? value : [value];
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

const mockNames = ['Maria Oliveira', 'João Silva', 'Ana Souza', 'Carlos Lima'];
const mockProjects = ['TaskFlow MVP', 'Onboarding', 'Documentação'];