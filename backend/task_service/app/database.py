from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Importa o Base central do seu projeto
from .base import Base

# PostgreSQL connection string
SQLALCHEMY_DATABASE_URL = "postgresql://taskly_user:taskly_password@task_db:5432/task_service_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Opcional: cria tabelas (somente para desenvolvimento)
# Base.metadata.create_all(bind=engine)

# Dependency para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
