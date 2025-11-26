import { z } from 'zod';

export const MonthlyProgressSchema = z.object({
  name: z.string(), // O mês (ex: Jan, Fev, Mar)
  'TaskFlow MVP': z.number(),
  'Onboarding': z.number(),
  'Documentação': z.number(),
});

export type MonthlyProgressData = z.infer<typeof MonthlyProgressSchema>;