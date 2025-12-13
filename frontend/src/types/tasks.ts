export type Priority = 'Alta' | 'Média' | 'Baixa';
export type Status = 'A Fazer' | 'Em Progresso' | 'Concluído';

export interface Task {
  id: string;
  title: string;
  responsible: string;
  avatarUrl?: string;
  priority: Priority;
  dueDate: string;
  status: Status;
}
