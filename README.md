# Taskly - Gerenciador de Projetos e Tarefas

## Visão Geral
O Taskly é uma plataforma de gerenciamento de projetos e tarefas que permite organizar, priorizar e acompanhar o andamento de atividades em equipe. O sistema oferece um painel com métricas visuais, gerenciamento de projetos e um quadro Kanban interativo.

## Estrutura do Projeto

### Backend
- **Linguagem**: Python 3.11+
- **Framework**: FastAPI
- **Banco de Dados**: PostgreSQL
- **ORM**: SQLAlchemy
- **Autenticação**: JWT
- **Testes**: Pytest

### Frontend
- **Framework**: Next.js 16
- **Linguagem**: TypeScript
- **UI**: TailwindCSS + Radix UI
- **Gerenciamento de Estado**: Zustand
- **Formulários**: React Hook Form + Zod
- **Drag and Drop**: @hello-pangea/dnd

## Arquitetura

### Padrão Arquitetural
O projeto segue os princípios da **Clean Architecture** e **Domain-Driven Design (DDD)**, com separação clara entre as camadas:

1. **Domínio (Domain)**
   - Entidades puras (Project, Task)
   - Interfaces de repositório
   - Regras de negócio

2. **Aplicação (Use Cases)**
   - Casos de uso (ProjectUseCase, TaskUseCase)
   - DTOs para transferência de dados
   - Lógica de negócios

3. **Infraestrutura**
   - Implementações concretas (SQLAlchemy)
   - Configurações de banco de dados
   - Adaptadores externos

4. **Interface (API)**
   - Rotas FastAPI
   - Controladores
   - Schemas de validação

### Estrutura de Pastas
```
taskly/
├── backend/
│   └── task_service/
│       ├── app/
│       │   ├── domain/         # Entidades e interfaces
│       │   ├── usecases/       # Lógica de negócios
│       │   ├── infra/          # Implementações concretas
│       │   └── schemas.py      # Schemas Pydantic
│       └── tests/              # Testes automatizados
│
└── frontend/
    ├── src/
    │   ├── app/               # Rotas e páginas
    │   ├── components/        # Componentes React
    │   ├── store/             # Gerenciamento de estado
    │   └── types/             # Tipos TypeScript
    └── public/                # Arquivos estáticos
```


## Como Executar

### Backend
```bash
cd backend/task_service
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Fluxo de Dados
1. Frontend faz requisições para a API RESTful
2. Backend processa as requisições usando os casos de uso
3. Repositórios acessam o banco de dados
4. Respostas são validadas e retornadas ao frontend
5. Interface atualiza o estado da aplicação

## Funcionalidades Principais
- Criação e gerenciamento de projetos
- Quadro Kanban para organização de tarefas
- Dashboard com métricas de produtividade
- Filtros e buscas avançadas
- Suporte a múltiplos usuários e times

## Banco de Dados
O banco de dados relacional possui as seguintes entidades principais:
- **Projects**: Armazena os projetos
- **Tasks**: Armazena as tarefas com status e prioridade
- **Users**: Gerencia autenticação e permissões

## Testes
```bash
# Executar testes do backend
cd backend/task_service
pytest

# Executar testes do frontend
cd frontend
npm test
```

## Licença
Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.

