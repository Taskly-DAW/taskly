from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Import the SQLAlchemy models to ensure they are registered with the Base metadata
from .infra.sqlalchemy_models import *

# PostgreSQL connection string for the Dockerized task_db service
SQLALCHEMY_DATABASE_URL = "postgresql://taskly_user:taskly_password@task_db:5432/task_service_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# This will create tables if they don't exist. In a production environment,
# you would typically use Alembic for migrations.
# However, for initial setup and development, this is convenient.
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
