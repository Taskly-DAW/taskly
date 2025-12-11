from typing import List, Optional

from ..domain.models import Project
from ..domain.interfaces.project_repository import ProjectRepository
from .dtos import ProjectCreateDTO, ProjectUpdateDTO

class ProjectUseCase:
    def __init__(self, project_repository: ProjectRepository):
        self.project_repository: ProjectRepository = project_repository

    def create_project(self, project_data: ProjectCreateDTO) -> Project:
        project = Project(name=project_data.name, tenant_id=project_data.tenant_id, description=project_data.description, responsible_id=project_data.responsible_id)
        return self.project_repository.create(project)

    def get_project_by_id(self, project_id: int) -> Optional[Project]:
        return self.project_repository.get_by_id(project_id)

    def get_all_projects(self, skip: int = 0, limit: int = 100) -> List[Project]:
        return self.project_repository.get_all(skip=skip, limit=limit)

    def get_projects_by_tenant_id(self, tenant_id: str) -> List[Project]:
        return self.project_repository.get_all_by_tenant(tenant_id)

    def update_project(self, project_id: int, project_data: ProjectUpdateDTO) -> Optional[Project]:
        existing_project = self.project_repository.get_by_id(project_id)
        if not existing_project:
            return None

        # Update only provided fields
        update_data = project_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing_project, key, value)

        return self.project_repository.update(project_id, existing_project)

    def delete_project(self, project_id: int) -> bool:
        return self.project_repository.delete(project_id)
