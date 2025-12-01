from typing import List, Optional

from ..domain.models import Project
from ..domain.interfaces.project_repository import ProjectRepository
from .dtos import ProjectCreateDTO, ProjectUpdateDTO

class ProjectUseCase:
    def __init__(self, project_repository: ProjectRepository):
        self.project_repository: ProjectRepository = project_repository

    def create_project(self, project_data: ProjectCreateDTO) -> Project:
        project = Project(name=project_data.name, description=project_data.description)
        return self.project_repository.create(project)

    def get_project_by_id(self, project_id: int) -> Optional[Project]:
        return self.project_repository.get_by_id(project_id)

    def get_all_projects(self, skip: int = 0, limit: int = 100) -> List[Project]:
        return self.project_repository.get_all(skip=skip, limit=limit)

    def update_project(self, project_id: int, project_data: ProjectUpdateDTO) -> Optional[Project]:
        existing_project = self.project_repository.get_by_id(project_id)
        if not existing_project:
            return None

        # Update only provided fields
        if project_data.name is not None:
            existing_project.name = project_data.name
        if project_data.description is not None:
            existing_project.description = project_data.description

        return self.project_repository.update(project_id, existing_project)

    def delete_project(self, project_id: int) -> bool:
        return self.project_repository.delete(project_id)
