import { getMonthLabel } from '@/lib/utils/dateUtils';
import authService from '@/services/authService';
import {
  MonthlyProgressData,
  StatusDistributionData,
} from '@/schemas/chartSchema';
import { create, StateCreator } from 'zustand';
import { Task, TaskApiSchema } from '@/schemas/taskSchema';
import { MOCK_TASKS } from '@/lib/mockData';
import { DashboardFilters, DashboardState } from '@/types/dashboard';
import z, { set } from 'zod';
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
  projects: Project[],
): MonthlyProgressData[] => {
  const monthlyData: { [key: string]: { [project: string]: number } } = {};
  const projectNames = projects?.map((p) => p.name);

  tasks?.forEach((task) => {
    const month = getMonthLabel(task.dueDate);
    const project = task.projectName || 'Desconhecido';

    if (!monthlyData[month]) {
      // Inicializa o mês com todos os projetos com contagem 0
      monthlyData[month] = projectNames.reduce(
        (acc, p) => ({ ...acc, [p]: 0 }),
        {},
      );
      // Adiciona uma chave para tarefas sem projeto definido, se necessário
      if (!monthlyData[month]['Desconhecido']) {
        monthlyData[month]['Desconhecido'] = 0;
      }
    }

    if (projectNames.includes(project)) {
      monthlyData[month][project] += 1;
    } else if (project === 'Desconhecido') {
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

const calculateProjectProgress = (
  projects: Project[],
  tasks: Task[],
): Project[] => {
  return projects.map((project) => {
    const projectTasks = tasks.filter(
      (task) => task.projectName === project.name,
    );

    if (projectTasks.length === 0) {
      return { ...project, progress: 0 };
    }

    const completedTasks = projectTasks.filter(
      (task) => task.status === 'Concluído',
    );
    const progress = Math.round(
      (completedTasks.length / projectTasks.length) * 100,
    );
    return { ...project, progress };
  });
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  projects: [],
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    const { tasks } = get();

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
        progress: 0,
        status: 'Ativos',
        responsible: {
          name: 'Admin',
          avatarUrl: '',
        },
      }));

      const { tasks } = get();
      if (tasks.length > 0) {
        const updatedProjects = calculateProjectProgress(uiProjects, tasks);
        set({ projects: updatedProjects, isLoading: false });
      } else {
        set({ projects: uiProjects, isLoading: false });
      }
    } catch (error) {
      console.error('Falha ao buscar projetos:', error);
      set({
        error: 'Não foi possível carregar os projetos.',
        isLoading: false,
      });
    }
  },
  createProject: async (newProjectData) => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:8002/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProjectData,
        }),
      });

      if (!response.ok) throw new Error('Falha ao criar projeto');

      await get().fetchProjects();
    } catch (error) {
      console.error(error);
      set({ error: 'Erro ao criar projeto' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (projectId, updatedData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`http://localhost:8002/projects/${projectId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

      if (!response.ok) throw new Error('Falha ao atualizar projeto');

      await get().fetchProjects(); // Re-fetch para atualizar a lista
    } catch (error) {
      console.error(error);
      set({ error: 'Erro ao atualizar projeto' });
    } finally {
      set({ isLoading: false });
    }
  },

  tasks: [],
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      if (get().projects.length === 0) {
        await get().fetchProjects();
      }

      const response = await fetch(
        'http://localhost:8002/tasks/?skip=0&limit=100',
      );

      if (!response.ok) throw new Error('Erro ao buscar tarefas');

      const rawData = await response.json();

      const apiTasks = z.array(TaskApiSchema).parse(rawData);

      const currentProjects = get().projects;

      const uiTasks: Task[] = apiTasks.map((t) => {
        const project = currentProjects?.find(
          (p) => p.id === t.project_id?.toString(),
        );

        return {
          id: t.id.toString(),
          title: t.title,
          status: mapStatus(t.status, t.completed),
          priority: mapPriority(t.priority),
          dueDate: new Date(t.created_at),
          projectName: project?.name || 'Desconhecido',
          responsible: {
            name: 'Usuário Padrão',
            initials: 'UP',
            avatarUrl: '',
          },
        };
      });

      const updatedProjects = calculateProjectProgress(currentProjects, uiTasks);
      set({ tasks: uiTasks, projects: updatedProjects, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
      set({ error: 'Não foi possível carregar as tarefas.', isLoading: false });
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
    period: '7d',
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get();

    return tasks.filter((task) => {
      const hasProjectFilter =
        filters.projects?.length > 0 &&
        !filters.projects?.includes('Todos os Projetos');
      if (
        hasProjectFilter &&
        !filters?.projects.includes(task.projectName || '')
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

  getProjectOptions: () => {
    const { projects } = get();

    const projectOptions = projects.map((p) => ({
      label: p.name,
      value: p.id,
    }));
    return [
      { label: 'Todos os Projetos', value: 'Todos os Projetos' },
      ...projectOptions,
    ];
  },

  getStatusOptions: () => {
    const statusNames = Object.keys(STATUS_COLORS).map((s) => ({
      label: s,
      value: s,
    }));
    return [
      { label: 'Todos os Status', value: 'Todos os Status' },
      ...statusNames,
    ];
  },

  fetchUsers: async () => {
        set({ isLoadingUsers: true, error: null });
        try {
          const users = await authService.fetchUsers();
          set({ users, isLoadingUsers: false });
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          set({ 
            error: 'Erro ao carregar usuários. Tente novamente mais tarde.',
            isLoadingUsers: false 
          });
        }
      },

  users: [],
  getResponsibleOptions: (): SelectOption<string>[] => {
        const { users } = get();
        return [
          { label: 'Todos os Responsáveis', value: 'Todos os Responsáveis' },
          ...users,
        ];
      },

  // getResponsibleOptions: async (): Promise<{label: string, value: string}[]> => {
  //   try {
  //     // Busca os usuários da API
  //     const users = await authService.fetchUsers();
      
  //     // Retorna os usuários formatados para o select
  //     return [
  //       { label: 'Todos os Responsáveis', value: 'Todos os Responsáveis' },
  //       ...users,
  //     ];
  //   } catch (error) {
  //     console.error('Erro ao buscar responsáveis:', error);
  //     // Retorna uma lista vazia em caso de erro
  //     return [
  //       { label: 'Todos os Responsáveis', value: 'Todos os Responsáveis' },
  //     ];
  //   }
  // },
}));
