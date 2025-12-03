"""
Domain Layer - Core Business Logic
Entities and Value Objects for Notifications
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class NotificationStatus(Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"


class Priority(Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


@dataclass
class EmailNotification:
    """Core domain entity for email notifications"""
    id: str
    tenant_id: str
    recipient_email: str
    recipient_name: Optional[str]
    subject: str
    html_body: str
    text_body: Optional[str] = None
    status: NotificationStatus = NotificationStatus.PENDING
    priority: Priority = Priority.NORMAL
    retry_count: int = 0
    max_retries: int = 3
    created_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.metadata is None:
            self.metadata = {}
    
    def mark_as_sent(self):
        """Mark notification as successfully sent"""
        self.status = NotificationStatus.SENT
        self.sent_at = datetime.utcnow()
        self.error_message = None
    
    def mark_as_failed(self, error_message: str):
        """Mark notification as failed"""
        self.status = NotificationStatus.FAILED
        self.error_message = error_message
    
    def can_retry(self) -> bool:
        """Check if notification can be retried"""
        return (
            self.status == NotificationStatus.FAILED and 
            self.retry_count < self.max_retries
        )
    
    def increment_retry(self):
        """Increment retry count"""
        self.retry_count += 1