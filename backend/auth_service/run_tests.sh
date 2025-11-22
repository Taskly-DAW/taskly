#!/bin/bash
# Script para executar testes no auth_service

set -e

cd "$(dirname "$0")"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Executando testes do auth_service${NC}"

# Instalar dependências de desenvolvimento se necessário
if [ "$1" = "--install" ]; then
    echo -e "${YELLOW}📦 Instalando dependências de desenvolvimento...${NC}"
    pip install -r requirements-dev.txt
fi

# Verificar se pytest está disponível
if ! command -v pytest &> /dev/null; then
    echo -e "${RED}❌ pytest não encontrado. Execute: pip install -r requirements-dev.txt${NC}"
    exit 1
fi

# Executar diferentes tipos de teste baseado no parâmetro
case "${1}" in
    "unit")
        echo -e "${YELLOW}🔧 Executando testes unitários...${NC}"
        pytest tests/test_domain tests/test_usecases -v
        ;;
    "integration")
        echo -e "${YELLOW}🔗 Executando testes de integração...${NC}"
        pytest tests/test_integration -v
        ;;
    "coverage")
        echo -e "${YELLOW}📊 Executando testes com coverage...${NC}"
        pytest --cov=app --cov-report=html --cov-report=term-missing
        ;;
    "fast")
        echo -e "${YELLOW}⚡ Executando testes rápidos (sem integração)...${NC}"
        pytest tests/test_domain tests/test_usecases tests/test_controllers -v
        ;;
    "")
        echo -e "${YELLOW}🚀 Executando todos os testes...${NC}"
        pytest -v
        ;;
    *)
        echo -e "${RED}❌ Opção inválida: $1${NC}"
        echo "Uso: $0 [unit|integration|coverage|fast|--install]"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Testes concluídos!${NC}"