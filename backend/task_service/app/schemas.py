from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Import domain models
from ..domain.models import Project, Task

# --- DTOs para Projetos ---

class ProjectCreateRequestDTO(BaseModel):
    name: str = Field(..., example="New Project Name")
    description: Optional[str] = Field(None, example="A brief description of the project.")

class ProjectUpdateRequestDTO(BaseModel):
    name: Optional[str] = Field(None, example="Updated Project Name")
    description: Optional[str] = Field(None, example="An updated description of the project.")

class ProjectResponseDTO(BaseModel):
    id: int = Field(..., example=1)
    name: str = Field(..., example="Project Name")
    description: Optional[str] = Field(None, example="Description of the project.")
    created_at: datetime = Field(..., example="2023-10-27T10:00:00.000000")
    updated_at: Optional[datetime] = Field(None, example="2023-10-27T11:30:00.000000")

    class Config:
        from_attributes = True


# --- DTOs para Tarefas ---

class TaskCreateRequestDTO(BaseModel):
    title: str = Field(..., example="New Task Title")
    project_id: int = Field(..., example=1)
    description: Optional[str] = Field(None, example="Details about the task.")
    status: str = Field("pending", example="in-progress")
    priority: int = Field(0, example=3)
    completed: bool = Field(False, example=False)

class TaskUpdateRequestDTO(BaseModel):
    title: Optional[str] = Field(None, example="Updated Task Title")
    description: Optional[str] = Field(None, example="Updated details about the task.")
    status: Optional[str] = Field(None, example="completed")
    priority: Optional[int] = Field(None, example=5)
    completed: Optional[bool] = Field(None, example=True)
    # project_id should not be updated directly via task update

class TaskResponseDTO(BaseModel):
    id: int = Field(..., example=1)
    title: str = Field(..., example="Task Title")
    description: Optional[str] = Field(None, example="Details about the task.")
    status: str = Field(..., example="pending")
    priority: int = Field(..., example=0)
    completed: bool = Field(..., example=False)
    project_id: int = Field(..., example=1)
    created_at: datetime = Field(..., example="2023-10-27T10:30:00.000000")
    updated_at: Optional[datetime] = Field(None, example="2023-10-27T12:00:00.000000")

    class Config:
        from_attributes = True

# --- DTOs para relacionamentos (opcional, para respostas mais ricas) ---

class ProjectWithTasksResponseDTO(ProjectResponseDTO):
    tasks: List[TaskResponseDTO] = []

    class Config:
        from_attributes = True

class TaskWithProjectResponseDTO(TaskResponseDTO):
    project: Optional[ProjectResponseDTO] = None

    class Config:
        from_attributes = True
