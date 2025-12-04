from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .database import get_db, Base, engine
from .infra.sqlalchemy_models import ProjectSQLA, TaskSQLA  # Import SQLA models for metadata
from .infra.sqlalchemy_repositories import SQLAlchemyProjectRepository, SQLAlchemyTaskRepository
from .usecases.project_usecase import ProjectUseCase
from .usecases.task_usecase import TaskUseCase
from .usecases.dtos import ProjectCreateDTO, ProjectUpdateDTO, TaskCreateDTO, TaskUpdateDTO
from .schemas import ProjectResponseDTO, ProjectWithTasksResponseDTO, TaskResponseDTO, TaskWithProjectResponseDTO

# Ensure tables are created (for development/initial setup)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Service API", version="1.0.0")

# --- CORS Middleware ---
# Permite que o frontend (em outro domínio/porta) acesse a API.
# O "*" é permissivo demais para produção, mas ótimo para desenvolvimento.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)


# Dependency Injector for ProjectUseCase
def get_project_use_case(db: Session = Depends(get_db)) -> ProjectUseCase:
    repository = SQLAlchemyProjectRepository(db)
    return ProjectUseCase(repository)

# Dependency Injector for TaskUseCase
def get_task_use_case(db: Session = Depends(get_db)) -> TaskUseCase:
    repository = SQLAlchemyTaskRepository(db)
    return TaskUseCase(repository)

# --- Project Endpoints ---

@app.post("/projects/", response_model=ProjectResponseDTO, status_code=status.HTTP_201_CREATED)
def create_project_endpoint(
    project_data: ProjectCreateDTO,
    project_use_case: ProjectUseCase = Depends(get_project_use_case)
):
    project = project_use_case.create_project(project_data)
    return ProjectResponseDTO.model_validate(project.to_dict())

@app.get("/projects/", response_model=List[ProjectResponseDTO])
def read_projects_endpoint(
    skip: int = 0,
    limit: int = 100,
    project_use_case: ProjectUseCase = Depends(get_project_use_case)
):
    projects = project_use_case.get_all_projects(skip=skip, limit=limit)
    return [ProjectResponseDTO.model_validate(p.to_dict()) for p in projects]

@app.get("/projects/{project_id}", response_model=ProjectResponseDTO)
def read_project_endpoint(
    project_id: int,
    project_use_case: ProjectUseCase = Depends(get_project_use_case)
):
    project = project_use_case.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponseDTO.model_validate(project.to_dict())

@app.put("/projects/{project_id}", response_model=ProjectResponseDTO)
def update_project_endpoint(
    project_id: int,
    project_data: ProjectUpdateDTO,
    project_use_case: ProjectUseCase = Depends(get_project_use_case)
):
    updated_project = project_use_case.update_project(project_id, project_data)
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponseDTO.model_validate(updated_project.to_dict())

@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_endpoint(
    project_id: int,
    project_use_case: ProjectUseCase = Depends(get_project_use_case)
):
    if not project_use_case.delete_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# --- Task Endpoints ---

@app.post("/tasks/", response_model=TaskResponseDTO, status_code=status.HTTP_201_CREATED)
def create_task_endpoint(
    task_data: TaskCreateDTO,
    task_use_case: TaskUseCase = Depends(get_task_use_case)
):
    task = task_use_case.create_task(task_data)
    return TaskResponseDTO.model_validate(task.to_dict())

@app.get("/tasks/", response_model=List[TaskResponseDTO])
def read_tasks_endpoint(
    skip: int = 0,
    limit: int = 100,
    task_use_case: TaskUseCase = Depends(get_task_use_case)
):
    tasks = task_use_case.get_all_tasks(skip=skip, limit=limit)
    return [TaskResponseDTO.model_validate(t.to_dict()) for t in tasks]

@app.get("/tasks/{task_id}", response_model=TaskResponseDTO)
def read_task_endpoint(
    task_id: int,
    task_use_case: TaskUseCase = Depends(get_task_use_case)
):
    task = task_use_case.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskResponseDTO.model_validate(task.to_dict())

@app.put("/tasks/{task_id}", response_model=TaskResponseDTO)
def update_task_endpoint(
    task_id: int,
    task_data: TaskUpdateDTO,
    task_use_case: TaskUseCase = Depends(get_task_use_case)
):
    updated_task = task_use_case.update_task(task_id, task_data)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskResponseDTO.model_validate(updated_task.to_dict())

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_endpoint(
    task_id: int,
    task_use_case: TaskUseCase = Depends(get_task_use_case)
):
    if not task_use_case.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
