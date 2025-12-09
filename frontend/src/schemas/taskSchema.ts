import { z } from 'zod';

export const TaskApiSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  priority: z.number(),
  completed: z.boolean(),
  project_id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
});

export const TaskUiSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  priority: z.enum(['Alta', 'Média', 'Baixa']),
  dueDate: z.date(),
  project_id: z.string().optional(),
  projectName: z.string().optional(),
  responsible: z.object({
    name: z.string(),
    avatarUrl: z.string().optional(),
    initials: z.string(),
  }),
});

export const ResponsibleSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().optional(),
  initials: z.string(),
});

export const TaskStatusSchema = z.enum([
  'A Fazer', 
  'Concluídas', 
  'Em Andamento', 
  'Atrasadas'
]);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Título é obrigatório'),
  status: TaskStatusSchema, 
  priority: z.enum(['Alta', 'Média', 'Baixa']),
  projectName: z.enum(['TaskFlow MVP', 'Onboarding', 'Documentação', 'Outros']),
  project_id: z.string(),
  responsible: ResponsibleSchema,

  dueDate: z.string(),
});

export type TaskApi = z.infer<typeof TaskApiSchema>;
export type Task = z.infer<typeof TaskUiSchema>;