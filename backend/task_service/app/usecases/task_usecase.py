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

    def update_task(self, task_id: int, task_data: TaskUpdateDTO) -> Optional[Task]:
        existing_task = self.task_repository.get_by_id(task_id)
        if not existing_task:
            return None

        # Update only provided fields
        if task_data.title is not None:
            existing_task.title = task_data.title
        if task_data.description is not None:
            existing_task.description = task_data.description
        if task_data.status is not None:
            existing_task.status = task_data.status
        if task_data.priority is not None:
            existing_task.priority = task_data.priority
        if task_data.completed is not None:
            existing_task.completed = task_data.completed

        return self.task_repository.update(task_id, existing_task)

    def delete_task(self, task_id: int) -> bool:
        return self.task_repository.delete(task_id)
