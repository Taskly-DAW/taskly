# Testes do Auth Service

Este diretório contém a estrutura completa de testes para o serviço de autenticação, seguindo os princípios da Clean Architecture.

## 📁 Estrutura dos Testes

```
tests/
├── conftest.py              # Configurações globais e fixtures
├── pytest.ini             # Configuração do pytest
├── __init__.py
│
├── test_domain/            # Testes da camada de domínio
│   ├── __init__.py
│   └── test_models.py      # Testes dos modelos User e Role
│
├── test_usecases/          # Testes da camada de casos de uso
│   ├── __init__.py
│   └── test_auth_usecase.py # Testes da lógica de autenticação
│
├── test_infra/             # Testes da camada de infraestrutura
│   ├── __init__.py
│   └── test_user_repository.py # Testes do repositório de usuários
│
├── test_controllers/       # Testes da camada de controle
│   ├── __init__.py
│   └── test_auth_controller.py # Testes dos endpoints da API
│
└── test_integration/       # Testes de integração
    ├── __init__.py
    └── test_auth_service.py # Testes end-to-end do serviço
```

## 🚀 Como Executar os Testes

### Pré-requisitos

1. Instalar dependências de desenvolvimento:
```bash
pip install -r requirements-dev.txt
```

### Executar Testes

#### Usando o script facilitador:
```bash
# Todos os testes
./run_tests.sh

# Apenas testes unitários
./run_tests.sh unit

# Apenas testes de integração
./run_tests.sh integration

# Testes com coverage
./run_tests.sh coverage

# Testes rápidos (sem integração)
./run_tests.sh fast

# Instalar dependências e executar
./run_tests.sh --install
```

#### Usando pytest diretamente:
```bash
# Todos os testes
pytest

# Testes específicos
pytest tests/test_domain/
pytest tests/test_usecases/
pytest tests/test_integration/

# Com verbose
pytest -v

# Com coverage
pytest --cov=app --cov-report=html
```

## 🧪 Tipos de Testes

### 1. Testes de Domínio (`test_domain/`)
- **Propósito**: Validar regras de negócio e entidades
- **Escopo**: Modelos `User` e `Role`
- **Características**: Rápidos, sem dependências externas

### 2. Testes de Casos de Uso (`test_usecases/`)
- **Propósito**: Validar a lógica de aplicação
- **Escopo**: `AuthUsecase` com autenticação e hash de senhas
- **Características**: Mocks para dependências externas

### 3. Testes de Infraestrutura (`test_infra/`)
- **Propósito**: Validar integração com banco de dados
- **Escopo**: `UserRepository` com operações CRUD
- **Características**: Usa SQLite em memória para isolamento

### 4. Testes de Controladores (`test_controllers/`)
- **Propósito**: Validar endpoints da API
- **Escopo**: `AuthController` com rotas FastAPI
- **Características**: Cliente HTTP de teste

### 5. Testes de Integração (`test_integration/`)
- **Propósito**: Validar fluxos completos end-to-end
- **Escopo**: Serviço completo com todas as camadas
- **Características**: Ambiente isolado completo

## ⚙️ Configurações

### Fixtures Principais

- **`async_engine`**: Engine SQLAlchemy async para testes
- **`async_session`**: Sessão de banco temporária
- **`user_repository`**: Repositório configurado para testes
- **`auth_usecase`**: Caso de uso com dependências mockadas
- **`test_client`**: Cliente HTTP para testes de API

### Marcadores de Teste

- **`@pytest.mark.asyncio`**: Para testes assíncronos
- **`@pytest.mark.unit`**: Testes unitários
- **`@pytest.mark.integration`**: Testes de integração

## 📊 Coverage

O coverage está configurado para:
- Gerar relatório HTML em `htmlcov/`
- Mostrar linhas não cobertas no terminal
- Focar no diretório `app/`

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de importação**: Certifique-se de estar no diretório correto
2. **Testes assíncronos falhando**: Verifique se `pytest-asyncio` está instalado
3. **Problemas de banco**: Os testes usam SQLite em memória, sem persistência

### Debug

Para debug detalhado:
```bash
pytest -v -s --tb=long
```

Para executar apenas um teste específico:
```bash
pytest tests/test_domain/test_models.py::test_user_creation -v
```

## 📝 Convenções

- **Nomes de teste**: `test_<funcionalidade>_<cenario>`
- **Fixtures**: Sempre usar `async` quando necessário
- **Mocks**: Preferir `pytest-mock` para mocking
- **Asserts**: Usar asserts descritivos e específicos

## 🎯 Próximos Passos

1. Executar os testes para validar a configuração
2. Resolver qualquer problema de dependência
3. Implementar testes adicionais conforme necessário
4. Configurar CI/CD com execução automática dos testes