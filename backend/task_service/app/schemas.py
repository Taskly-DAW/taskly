from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Changed from orm_mode = True for Pydantic v2

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: int = 0
    completed: bool = False
    project_id: int

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Changed from orm_mode = True for Pydantic v2

# For relationships, you might want to define schemas that include nested objects
class ProjectWithTasks(Project):
    tasks: List["Task"] = []

    class Config:
        from_attributes = True # Changed from orm_mode = True for Pydantic v2


class TaskWithProject(Task):
    project: Optional[Project] = None

    class Config:
        from_attributes = True # Changed from orm_mode = True for Pydantic v2

