import { z } from 'zod';

export const ProjectApiSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  created_at: z.string(),
  responsible_id: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const ProjectUiSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  responsible: z.object({
    name: z.string(),
    avatarUrl: z.string().url().optional(),
  }),
  progress: z.number().min(0).max(100),
  dueDate: z.string().pipe(z.coerce.date()),
  status: z.enum(['Ativos', 'Concluídos', 'Arquivados']),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  responsible_id: z.string().min(1, 'Por favor, selecione um responsável'),
});

export type ProjectApi = z.infer<typeof ProjectApiSchema>;
export type Project = z.infer<typeof ProjectUiSchema>;
export type CreateProjectFormData = z.infer<typeof CreateProjectSchema>;
