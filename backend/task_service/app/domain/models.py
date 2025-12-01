from datetime import datetime
from typing import Optional, List

class Project:
    def __init__(
        self, 
        name: str,
        description: Optional[str] = None,
        id: Optional[int] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.created_at = created_at if created_at else datetime.now()
        self.updated_at = updated_at
        self.tasks: List[Task] = [] # Initialize with an empty list

    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}')>"

class Task:
    def __init__(
        self,
        title: str,
        project_id: int,
        description: Optional[str] = None,
        status: str = "pending",
        priority: int = 0,
        completed: bool = False,
        id: Optional[int] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.title = title
        self.description = description
        self.status = status
        self.priority = priority
        self.completed = completed
        self.project_id = project_id
        self.created_at = created_at if created_at else datetime.now()
        self.updated_at = updated_at
        self.project: Optional[Project] = None # Will be set by relationships

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', project_id={self.project_id})>"
