"""
Domain Layer - Service Interfaces
Abstract interfaces for external services
"""

from abc import ABC, abstractmethod
from typing import Dict, Any
from .models import EmailNotification


class EmailService(ABC):
    """Interface for email sending service"""
    
    @abstractmethod
    async def send_email(self, notification: EmailNotification) -> bool:
        """Send email notification"""
        pass
    
    @abstractmethod
    async def verify_connection(self) -> bool:
        """Verify email service connection"""
        pass


class TemplateEngine(ABC):
    """Interface for template rendering engine"""
    
    @abstractmethod
    def render_template(self, template_content: str, context: Dict[str, Any]) -> str:
        """Render template with given context"""
        pass
    
    @abstractmethod
    def render_subject(self, subject_template: str, context: Dict[str, Any]) -> str:
        """Render email subject with context"""
        pass


class EventPublisher(ABC):
    """Interface for publishing domain events"""
    
    @abstractmethod
    async def publish_notification_sent(self, notification: EmailNotification) -> bool:
        """Publish notification sent event"""
        pass
    
    @abstractmethod
    async def publish_notification_failed(self, notification: EmailNotification) -> bool:
        """Publish notification failed event"""
        pass