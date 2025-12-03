"""
Domain Layer - Repository Interfaces
Abstract interfaces for data persistence
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from .models import EmailNotification, NotificationStatus


class NotificationRepository(ABC):
    """Repository interface for notification persistence"""
    
    @abstractmethod
    async def save(self, notification: EmailNotification) -> EmailNotification:
        """Save or update a notification"""
        pass
    
    @abstractmethod
    async def find_by_id(self, notification_id: str) -> Optional[EmailNotification]:
        """Find notification by ID"""
        pass
    
    @abstractmethod
    async def find_pending(self, limit: int = 100) -> List[EmailNotification]:
        """Find pending notifications for processing"""
        pass
    
    @abstractmethod
    async def find_failed_retryable(self, limit: int = 100) -> List[EmailNotification]:
        """Find failed notifications that can be retried"""
        pass
    
    @abstractmethod
    async def update_status(
        self, 
        notification_id: str, 
        status: NotificationStatus,
        error_message: Optional[str] = None
    ) -> bool:
        """Update notification status"""
        pass
    
    @abstractmethod
    async def delete(self, notification_id: str) -> bool:
        """Delete notification by ID"""
        pass


class TemplateRepository(ABC):
    """Repository interface for email templates"""
    
    @abstractmethod
    async def find_by_name(self, template_name: str) -> Optional[dict]:
        """Find template by name"""
        pass
    
    @abstractmethod
    async def save_template(
        self, 
        name: str, 
        subject: str, 
        html_body: str, 
        text_body: Optional[str] = None
    ) -> bool:
        """Save or update email template"""
        pass