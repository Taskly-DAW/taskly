import {
  MonthlyProgressData,
  StatusDistributionData,
} from '@/schemas/chartSchema';
import { Task } from '@/schemas/taskSchema';
import { CreateProjectFormData, Project, ProjectUiSchema } from '@/schemas/projectSchema';

export interface DashboardFilters {
  projects: string[];
  status: string[];
  responsible: string[];
  period: string;
}

export interface DashboardState {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;
  moveTask: (taskId: string, newStatus: string) => void;
  setFilter: (key: keyof DashboardFilters, value: string) => void;
  fetchProjects: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  getFilteredTasks: () => Task[]; // Nova função exposta
  createProject: (data: CreateProjectFormData) => Promise<void>;
}
