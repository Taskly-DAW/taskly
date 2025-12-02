import { z } from 'zod';

export const MonthlyProgressSchema = z.object({
  name: z.string(), // O mês (ex: Jan, Fev, Mar)
  'TaskFlow MVP': z.number(),
  'Onboarding': z.number(),
  'Documentação': z.number(),
});

export const StatusDistributionDataSchema = z.object({
  name: z.enum(['Concluídas', 'Em Andamento', 'Atrasadas']), // O rótulo
  value: z.number(), // A contagem de tarefas
  color: z.string(), // A cor no gráfico
});

export type MonthlyProgressData = z.infer<typeof MonthlyProgressSchema>;

export type StatusDistributionData = z.infer<typeof StatusDistributionDataSchema>;