import { z } from 'zod';

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
  
  projectId: z.string(),
  responsible: ResponsibleSchema,

  dueDate: z.string().pipe(z.coerce.date()),
});

export type Task = z.infer<typeof TaskSchema>;