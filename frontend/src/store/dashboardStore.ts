// src/store/dashboardStore.ts (Adicionando a função de agregação)

import { getMonthLabel } from "@/lib/utils/dateUtils";
import { MonthlyProgressData } from "@/schemas/chartSchema";
import { create } from "zustand";


const aggregateMonthlyProgress = (tasks: [], filters: []): MonthlyProgressData[] => { 
  const monthlyData: { [key: string]: { [project: string]: number } } = {};
  
  tasks.forEach(task => {
    const month = getMonthLabel(task.dueDate); 
    const project = task.projectName; 
    
    if (!monthlyData[month]) {
      monthlyData[month] = { 'TaskFlow MVP': 0, 'Onboarding': 0, 'Documentação': 0 };
    }
    
    if (monthlyData[month][project] !== undefined) {
      monthlyData[month][project] += 1;
    }
  });

  return Object.keys(monthlyData).map(month => ({
    name: month,
    ...monthlyData[month],
  }));
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  getMonthlyProgress: () => {
    const { tasks, filters } = get();
    return aggregateMonthlyProgress(tasks, filters);
  }
}));