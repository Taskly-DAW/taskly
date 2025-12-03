import { MonthlyProgressData, StatusDistributionData } from "@/schemas/chartSchema";
import { Task } from "@/schemas/taskSchema";

export interface DashboardFilters {
  project: string[];
  status: string[];
  responsible: string[];
  period: string;
}

export interface DashboardState {
  tasks: Task[];
  filters: DashboardFilters;
  moveTask: (taskId: string, newStatus: string) => void;
  setFilter: (key: keyof DashboardFilters, value: string) => void;
  
  getMonthlyProgress: () => MonthlyProgressData[];
  getStatusDistribution: () => StatusDistributionData[];
}