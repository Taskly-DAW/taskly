from typing import Optional, List
from pydantic import BaseModel

# DTOs para Casos de Uso (entrada)
class ProjectCreateDTO(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class TaskCreateDTO(BaseModel):
    title: str
    project_id: int
    description: Optional[str] = None
    status: str = "pending"
    priority: int = 0
    completed: bool = False

class TaskUpdateDTO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None
    completed: Optional[bool] = None
