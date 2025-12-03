from abc import ABC, abstractmethod
from typing import List, Optional
from ..models import Project

class ProjectRepository(ABC):
    @abstractmethod
    def create(self, project: Project) -> Project:
        pass

    @abstractmethod
    def get_by_id(self, project_id: int) -> Optional[Project]:
        pass

    @abstractmethod
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Project]:
        pass

    @abstractmethod
    def update(self, project_id: int, project: Project) -> Optional[Project]:
        pass

    @abstractmethod
    def delete(self, project_id: int) -> bool:
        pass
