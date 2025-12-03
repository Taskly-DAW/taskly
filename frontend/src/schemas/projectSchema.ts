import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  responsible: z.object({
    name: z.string(),
    avatarUrl: z.string().url().optional(),
  }),
  progress: z.number().min(0).max(100),
  dueDate: z.string().pipe(z.coerce.date()),
  status: z.enum(['Ativos', 'Concluídos', 'Arquivados']),
});

export type Project = z.infer<typeof ProjectSchema>;