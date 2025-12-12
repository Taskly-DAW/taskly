interface Responsible {
  name: string;
  avatarUrl: string;
  initials: string;
}

interface Task {
  id: string;
  title: string;
  status: 'Concluídas' | 'Atrasadas' | 'A Fazer' | 'Em Andamento';
  priority: 'Alta' | 'Média' | 'Baixa';
  dueDate: string; // Formato YYYY-MM-DD
  responsible: Responsible;
  projectId: string; // Para o MonthlyProgressChart
  projectName: 'TaskFlow MVP' | 'Onboarding' | 'Documentação' | 'Outros'; // Para o MonthlyProgressChart
}

interface Project {
  id: string;
  name: string;
  responsible: Responsible;
  progress: number;
  dueDate: Date;
  status: 'Ativos' | 'Concluídos' | 'Arquivados';
}

// --- Responsáveis Comuns ---
const RESPONSIBLE_MO: Responsible = { name: "Maria Oliveira", avatarUrl: "/img/avatars/mo.jpg", initials: "MO" };
const RESPONSIBLE_JS: Responsible = { name: "João Silva", avatarUrl: "/img/avatars/js.jpg", initials: "JS" };
const RESPONSIBLE_AS: Responsible = { name: "Ana Souza", avatarUrl: "/img/avatars/as.jpg", initials: "AS" };
const RESPONSIBLE_CL: Responsible = { name: "Carlos Lima", avatarUrl: "/img/avatars/cl.jpg", initials: "CL" };


export const MOCK_TASKS: Task[] = [
  // TAREFAS CONCLUÍDAS
  { id: "T001", title: "Configurar variáveis de ambiente", status: "Concluídas", priority: "Média", dueDate: "2025-05-10", responsible: RESPONSIBLE_MO, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T002", title: "Refatorar componente de Sidebar", status: "Concluídas", priority: "Baixa", dueDate: "2025-04-20", responsible: RESPONSIBLE_JS, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T003", title: "Desenho UI/UX do Painel", status: "Concluídas", priority: "Alta", dueDate: "2025-05-01", responsible: RESPONSIBLE_AS, projectId: "P2", projectName: "Onboarding" },
  { id: "T004", title: "Revisão de performance do banco", status: "Concluídas", priority: "Alta", dueDate: "2025-05-15", responsible: RESPONSIBLE_CL, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T005", title: "Preparar documentação API v1", status: "Concluídas", priority: "Média", dueDate: "2025-06-05", responsible: RESPONSIBLE_MO, projectId: "P3", projectName: "Documentação" },
  { id: "T006", title: "Implementar autenticação Zod", status: "Concluídas", priority: "Alta", dueDate: "2025-06-12", responsible: RESPONSIBLE_JS, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T007", title: "Teste de usabilidade do modal", status: "Concluídas", priority: "Média", dueDate: "2025-05-25", responsible: RESPONSIBLE_AS, projectId: "P2", projectName: "Onboarding" },
  // TAREFAS EM ANDAMENTO
  { id: "T008", title: "Desenvolver feature de autenticação", status: "Em Andamento", priority: "Alta", dueDate: "2025-07-15", responsible: RESPONSIBLE_JS, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T009", title: "Configurar ambiente de staging", status: "Em Andamento", priority: "Alta", dueDate: "2025-07-18", responsible: RESPONSIBLE_AS, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T010", title: "Criar wireframes p/ relatórios", status: "Em Andamento", priority: "Média", dueDate: "2025-07-20", responsible: RESPONSIBLE_MO, projectId: "P3", projectName: "Documentação" },
  { id: "T011", title: "Testar integração de pagamentos", status: "Em Andamento", priority: "Média", dueDate: "2025-07-22", responsible: RESPONSIBLE_CL, projectId: "P2", projectName: "Onboarding" },
  // TAREFAS ATRASADAS
  { id: "T012", title: "Revisão de segurança do código", status: "Atrasadas", priority: "Alta", dueDate: "2025-04-01", responsible: RESPONSIBLE_JS, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T013", title: "Atualizar políticas de privacidade", status: "Atrasadas", priority: "Média", dueDate: "2025-05-01", responsible: RESPONSIBLE_MO, projectId: "P3", projectName: "Documentação" },
  // TAREFAS 'A FAZER'
  { id: "T014", title: "Planejamento da Sprint 3", status: "A Fazer", priority: "Alta", dueDate: "2025-08-01", responsible: RESPONSIBLE_MO, projectId: "P1", projectName: "TaskFlow MVP" },
  { id: "T015", title: "Revisar documentação técnica do projeto X", status: "A Fazer", priority: "Baixa", dueDate: "2025-07-25", responsible: RESPONSIBLE_AS, projectId: "P3", projectName: "Documentação" },
  { id: "T016", title: "Configurar CI/CD", status: "A Fazer", priority: "Alta", dueDate: "2025-08-10", responsible: RESPONSIBLE_CL, projectId: "P1", projectName: "TaskFlow MVP" },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "P1",
    name: "Desenvolvimento da Plataforma v2",
    responsible: RESPONSIBLE_MO,
    progress: 75,
    dueDate: new Date("2024-12-31"),
    status: "Ativos",
  },
  {
    id: "P2",
    name: "Campanha de Marketing Digital Q3",
    responsible: RESPONSIBLE_JS,
    progress: 90,
    dueDate: new Date("2024-09-30"),
    status: "Ativos",
  },
  {
    id: "P3",
    name: "Otimização de Processos Internos",
    responsible: RESPONSIBLE_AS,
    progress: 40,
    dueDate: new Date("2025-03-15"),
    status: "Ativos",
  },
  {
    id: "P4",
    name: "Lançamento de Novo Produto X",
    responsible: RESPONSIBLE_CL,
    progress: 100,
    dueDate: new Date("2024-11-01"),
    status: "Concluídos",
  },
];