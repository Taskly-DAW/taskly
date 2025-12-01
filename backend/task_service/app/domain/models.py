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
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict):
        # data may contain keys from SQLAlchemy model __dict__
        return cls(
            id=data.get("id"),
            name=data.get("name"),
            description=data.get("description"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )

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
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "completed": self.completed,
            "project_id": self.project_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            id=data.get("id"),
            title=data.get("title"),
            project_id=data.get("project_id"),
            description=data.get("description"),
            status=data.get("status", "pending"),
            priority=data.get("priority", 0),
            completed=data.get("completed", False),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )
