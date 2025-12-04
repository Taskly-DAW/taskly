import { MonthlyProgressData, StatusDistributionData } from "@/schemas/chartSchema";
import { Task } from "@/schemas/taskSchema";

export interface DashboardFilters {
  project: string[];
  status: string[];
  responsible: string[];
  period: string;
}

export interface DashboardState {
  tasks: Task[]; // Lista completa de tarefas
  filters: DashboardFilters;
  setFilter: (key: keyof DashboardFilters, value: string) => void;
  
  getMonthlyProgress: () => MonthlyProgressData[];
  getStatusDistribution: () => StatusDistributionData[];
}