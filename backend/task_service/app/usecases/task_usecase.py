from typing import List, Optional

from ..domain.models import Task
from ..domain.interfaces.task_repository import TaskRepository
from .dtos import TaskCreateDTO, TaskUpdateDTO

class TaskUseCase:
    def __init__(self, task_repository: TaskRepository):
        self.task_repository: TaskRepository = task_repository

    def create_task(self, task_data: TaskCreateDTO) -> Task:
        task = Task(
            title=task_data.title,
            description=task_data.description,
            responsible_id=task_data.responsible_id,
            status=task_data.status,
            priority=task_data.priority,
            completed=task_data.completed,
            project_id=task_data.project_id
        )
        return self.task_repository.create(task)

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        return self.task_repository.get_by_id(task_id)

    def get_all_tasks(self, skip: int = 0, limit: int = 100) -> List[Task]:
        return self.task_repository.get_all(skip=skip, limit=limit)

    def get_tasks_by_project_id(self, project_id: int) -> List[Task]:
        return self.task_repository.get_by_project_id(project_id)

    def update_task(self, task_id: int, task_data: TaskUpdateDTO) -> Optional[Task]:
        existing_task = self.task_repository.get_by_id(task_id)
        if not existing_task:
            return None

        # Update only provided fields
        update_data = task_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing_task, key, value)

        return self.task_repository.update(task_id, existing_task)

    def delete_task(self, task_id: int) -> bool:
        return self.task_repository.delete(task_id)
