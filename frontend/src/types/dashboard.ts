import {
  MonthlyProgressData,
  StatusDistributionData,
} from '@/schemas/chartSchema';
import { Task } from '@/schemas/taskSchema';
import {
  CreateProjectFormData,
  Project,
  ProjectUiSchema,
} from '@/schemas/projectSchema';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface DashboardFilters {
  projects: string[];
  status: string[];
  responsible: string[];
  period: string;
  projectSearch: string;
  projectStatus: string[];
}

export interface DashboardState {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;
  moveTask: (taskId: string, newStatus: string) => void;
  setFilter: (key: keyof DashboardFilters, value: string | string[]) => void;
  fetchProjects: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  createTask: (taskData: {
    title: string;
    project_id: number;
    description: string;
    status: 'todo' | 'doing' | 'block' | 'done';
    priority: number;
    completed: boolean;
  }) => Promise<void>;
  updateTask: (
    taskId: string,
    taskData: {
      title: string;
      project_id: number;
      description: string;
      status: 'todo' | 'doing' | 'block' | 'done';
      priority: number;
      completed: boolean;
    },
  ) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>;
  getFilteredTasks: () => Task[];
  getFilteredProjects: () => Project[];
  createProject: (data: CreateProjectFormData) => Promise<void>;
  updateProject: (
    projectId: string,
    data: CreateProjectFormData,
  ) => Promise<void>;
  getResponsibleOptions: () => SelectOption[];
  getProjectOptions: () => SelectOption[];
  users: SelectOption[];
  fetchUsers: () => Promise<void>;
  isLoadingUsers: boolean;
}
