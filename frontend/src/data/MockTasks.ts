import { Task } from '@/types/tasks';

export const MOCK_TASKS: Task[] = [
  // 📌 A FAZER
  {
    id: '1',
    title: 'Desenvolver feature de autenticação',
    responsible: 'João Silva',
    avatarUrl: '',
    priority: 'Alta',
    dueDate: '2024-07-15',
    status: 'A Fazer',
  },
  {
    id: '2',
    title: 'Criar wireframes para o módulo de relatórios',
    responsible: 'Maria Oliveira',
    avatarUrl: '',
    priority: 'Média',
    dueDate: '2024-07-20',
    status: 'A Fazer',
  },
  {
    id: '3',
    title: 'Revisar documentação técnica do projeto X',
    responsible: 'Pedro Costa',
    avatarUrl: '',
    priority: 'Baixa',
    dueDate: '2024-07-25',
    status: 'A Fazer',
  },

  // 📌 EM PROGRESSO
  {
    id: '4',
    title: 'Configurar ambiente de staging',
    responsible: 'Ana Souza',
    avatarUrl: '',
    priority: 'Alta',
    dueDate: '2024-07-18',
    status: 'Em Progresso',
  },
  {
    id: '5',
    title: 'Testar integração de pagamentos',
    responsible: 'Carlos Lima',
    avatarUrl: '',
    priority: 'Média',
    dueDate: '2024-07-22',
    status: 'Em Progresso',
  },

  // 📌 CONCLUÍDO
  {
    id: '6',
    title: 'Preparar apresentação para stakeholders',
    responsible: 'Mariana Santos',
    avatarUrl: '',
    priority: 'Alta',
    dueDate: '2024-07-16',
    status: 'Concluído',
  },
  {
    id: '7',
    title: 'Finalizar relatório de Q2',
    responsible: 'Felipe Alves',
    avatarUrl: '',
    priority: 'Baixa',
    dueDate: '2024-07-30',
    status: 'Concluído',
  },
];
