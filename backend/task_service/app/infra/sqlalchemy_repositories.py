from sqlalchemy.orm import Session
from typing import List, Optional

from ..domain.models import Project, Task
from ..domain.interfaces.project_repository import ProjectRepository
from ..domain.interfaces.task_repository import TaskRepository
from .sqlalchemy_models import ProjectSQLA, TaskSQLA

class SQLAlchemyProjectRepository(ProjectRepository):
    def __init__(self, db: Session):
        self.db = db

    def create(self, project: Project) -> Project:
        db_project = ProjectSQLA(**project.to_dict())
        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)
        return Project.from_dict(db_project.__dict__)

    def get_by_id(self, project_id: int) -> Optional[Project]:
        db_project = self.db.query(ProjectSQLA).filter(ProjectSQLA.id == project_id).first()
        if db_project:
            return Project.from_dict(db_project.__dict__)
        return None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Project]:
        projects = self.db.query(ProjectSQLA).offset(skip).limit(limit).all()
        return [Project.from_dict(p.__dict__) for p in projects]

    def get_all_by_tenant(self, tenant_id: str) -> List[Project]:
        projects = self.db.query(ProjectSQLA).filter(ProjectSQLA.tenant_id == tenant_id).all()
        return [Project.from_dict(p.__dict__) for p in projects]

    def update(self, project_id: int, project: Project) -> Optional[Project]:
        db_project = self.db.query(ProjectSQLA).filter(ProjectSQLA.id == project_id).first()
        if db_project:
            for key, value in project.to_dict().items():
                if hasattr(db_project, key) and key != 'id' and key != 'created_at':
                    setattr(db_project, key, value)
            self.db.commit()
            self.db.refresh(db_project)
            return Project.from_dict(db_project.__dict__)
        return None

    def delete(self, project_id: int) -> bool:
        db_project = self.db.query(ProjectSQLA).filter(ProjectSQLA.id == project_id).first()
        if db_project:
            self.db.delete(db_project)
            self.db.commit()
            return True
        return False

class SQLAlchemyTaskRepository(TaskRepository):
    def __init__(self, db: Session):
        self.db = db

    def create(self, task: Task) -> Task:
        db_task = TaskSQLA(**task.to_dict())
        self.db.add(db_task)
        self.db.commit()
        self.db.refresh(db_task)
        return Task.from_dict(db_task.__dict__)

    def get_by_id(self, task_id: int) -> Optional[Task]:
        db_task = self.db.query(TaskSQLA).filter(TaskSQLA.id == task_id).first()
        if db_task:
            return Task.from_dict(db_task.__dict__)
        return None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Task]:
        tasks = self.db.query(TaskSQLA).offset(skip).limit(limit).all()
        return [Task.from_dict(t.__dict__) for t in tasks]

    def get_by_project_id(self, project_id: int) -> List[Task]:
        tasks = self.db.query(TaskSQLA).filter(TaskSQLA.project_id == project_id).all()
        return [Task.from_dict(t.__dict__) for t in tasks]

    def update(self, task_id: int, task: Task) -> Optional[Task]:
        db_task = self.db.query(TaskSQLA).filter(TaskSQLA.id == task_id).first()
        if db_task:
            for key, value in task.to_dict().items():
                if hasattr(db_task, key) and key != 'id' and key != 'created_at':
                    setattr(db_task, key, value)
            self.db.commit()
            self.db.refresh(db_task)
            return Task.from_dict(db_task.__dict__)
        return None

    def delete(self, task_id: int) -> bool:
        db_task = self.db.query(TaskSQLA).filter(TaskSQLA.id == task_id).first()
        if db_task:
            self.db.delete(db_task)
            self.db.commit()
            return True
        return False
