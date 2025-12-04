import { z } from 'zod';

// 1. Schema do que vem EXATAMENTE da sua API (Backend)
export const ProjectApiSchema = z.object({
  id: z.number(), // A API retorna number
  name: z.string(),
  description: z.string().nullable().optional(),
  created_at: z.string(), // Vem como string ISO
  updated_at: z.string().nullable().optional(),
});

export const ProjectUiSchema = z.object({
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

export type ProjectApi = z.infer<typeof ProjectApiSchema>;
export type Project = z.infer<typeof ProjectUiSchema>; // Esse é o tipo usado nos componentes