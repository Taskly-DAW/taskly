from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base

class ProjectSQLA(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(String, index=True, nullable=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    responsible_id = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    tasks = relationship("TaskSQLA", back_populates="project")

class TaskSQLA(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    responsible_id = Column(String, nullable=True)
    status = Column(String, default="pending") # e.g., "pending", "in-progress", "completed"
    priority = Column(Integer, default=0) # e.g., 0 (low) to 5 (high)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("ProjectSQLA", back_populates="tasks")
