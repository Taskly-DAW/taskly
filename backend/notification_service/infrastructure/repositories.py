"""
Infrastructure Layer - Repository Implementation
SQLAlchemy implementation for notification persistence
"""

import asyncio
from typing import Optional, List
from sqlalchemy import Column, String, DateTime, Integer, Text, Enum as SQLEnum, Boolean
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.future import select
from sqlalchemy import update, delete
from datetime import datetime
import json

from domain.models import EmailNotification, NotificationStatus, Priority
from domain.repositories import NotificationRepository, TemplateRepository

Base = declarative_base()


class NotificationModel(Base):
    """SQLAlchemy model for email notifications"""
    
    __tablename__ = 'notifications'
    
    id = Column(String(36), primary_key=True)
    tenant_id = Column(String(100), nullable=False, index=True)
    recipient_email = Column(String(255), nullable=False, index=True)
    recipient_name = Column(String(255), nullable=True)
    subject = Column(String(500), nullable=False)
    html_body = Column(Text, nullable=False)
    text_body = Column(Text, nullable=True)
    status = Column(SQLEnum(NotificationStatus), nullable=False, default=NotificationStatus.PENDING, index=True)
    priority = Column(SQLEnum(Priority), nullable=False, default=Priority.NORMAL)
    retry_count = Column(Integer, nullable=False, default=0)
    max_retries = Column(Integer, nullable=False, default=3)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    notification_metadata = Column(Text, nullable=True)  # JSON string
    
    def to_domain(self) -> EmailNotification:
        """Convert to domain model"""
        notification_meta = json.loads(self.notification_metadata) if self.notification_metadata else {}
        
        return EmailNotification(
            id=self.id,
            tenant_id=self.tenant_id,
            recipient_email=self.recipient_email,
            recipient_name=self.recipient_name,
            subject=self.subject,
            html_body=self.html_body,
            text_body=self.text_body,
            status=self.status,
            priority=self.priority,
            retry_count=self.retry_count,
            max_retries=self.max_retries,
            created_at=self.created_at,
            sent_at=self.sent_at,
            error_message=self.error_message,
            metadata=notification_meta
        )
    
    @classmethod
    def from_domain(cls, notification: EmailNotification) -> 'NotificationModel':
        """Create from domain model"""
        metadata_json = json.dumps(notification.metadata) if notification.metadata else None
        
        return cls(
            id=notification.id,
            tenant_id=notification.tenant_id,
            recipient_email=notification.recipient_email,
            recipient_name=notification.recipient_name,
            subject=notification.subject,
            html_body=notification.html_body,
            text_body=notification.text_body,
            status=notification.status,
            priority=notification.priority,
            retry_count=notification.retry_count,
            max_retries=notification.max_retries,
            created_at=notification.created_at,
            sent_at=notification.sent_at,
            error_message=notification.error_message,
            notification_metadata=metadata_json
        )


class TemplateModel(Base):
    """SQLAlchemy model for email templates"""
    
    __tablename__ = 'email_templates'
    
    name = Column(String(100), primary_key=True)
    subject = Column(String(500), nullable=False)
    html_body = Column(Text, nullable=False)
    text_body = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    active = Column(Boolean, nullable=False, default=True)


class SQLAlchemyNotificationRepository(NotificationRepository):
    """SQLAlchemy implementation of notification repository"""
    
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self.session_factory = session_factory
    
    async def save(self, notification: EmailNotification) -> EmailNotification:
        """Save or update a notification"""
        
        async with self.session_factory() as session:
            # Check if notification exists
            stmt = select(NotificationModel).where(NotificationModel.id == notification.id)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                # Update existing
                notification_model = NotificationModel.from_domain(notification)
                stmt = update(NotificationModel).where(
                    NotificationModel.id == notification.id
                ).values(
                    status=notification_model.status,
                    retry_count=notification_model.retry_count,
                    sent_at=notification_model.sent_at,
                    error_message=notification_model.error_message,
                    notification_metadata=notification_model.notification_metadata
                )
                await session.execute(stmt)
            else:
                # Create new
                notification_model = NotificationModel.from_domain(notification)
                session.add(notification_model)
            
            await session.commit()
            return notification
    
    async def find_by_id(self, notification_id: str) -> Optional[EmailNotification]:
        """Find notification by ID"""
        
        async with self.session_factory() as session:
            stmt = select(NotificationModel).where(NotificationModel.id == notification_id)
            result = await session.execute(stmt)
            notification_model = result.scalar_one_or_none()
            
            return notification_model.to_domain() if notification_model else None
    
    async def find_pending(self, limit: int = 100) -> List[EmailNotification]:
        """Find pending notifications for processing"""
        
        async with self.session_factory() as session:
            stmt = select(NotificationModel).where(
                NotificationModel.status == NotificationStatus.PENDING
            ).order_by(
                NotificationModel.priority.desc(),
                NotificationModel.created_at.asc()
            ).limit(limit)
            
            result = await session.execute(stmt)
            notifications = result.scalars().all()
            
            return [n.to_domain() for n in notifications]
    
    async def find_failed_retryable(self, limit: int = 100) -> List[EmailNotification]:
        """Find failed notifications that can be retried"""
        
        async with self.session_factory() as session:
            stmt = select(NotificationModel).where(
                NotificationModel.status == NotificationStatus.FAILED,
                NotificationModel.retry_count < NotificationModel.max_retries
            ).order_by(
                NotificationModel.created_at.asc()
            ).limit(limit)
            
            result = await session.execute(stmt)
            notifications = result.scalars().all()
            
            return [n.to_domain() for n in notifications]
    
    async def update_status(
        self, 
        notification_id: str, 
        status: NotificationStatus,
        error_message: Optional[str] = None
    ) -> bool:
        """Update notification status"""
        
        async with self.session_factory() as session:
            update_values = {'status': status}
            if error_message is not None:
                update_values['error_message'] = error_message
            if status == NotificationStatus.SENT:
                update_values['sent_at'] = datetime.utcnow()
            
            stmt = update(NotificationModel).where(
                NotificationModel.id == notification_id
            ).values(**update_values)
            
            result = await session.execute(stmt)
            await session.commit()
            
            return result.rowcount > 0
    
    async def delete(self, notification_id: str) -> bool:
        """Delete notification by ID"""
        
        async with self.session_factory() as session:
            stmt = delete(NotificationModel).where(NotificationModel.id == notification_id)
            result = await session.execute(stmt)
            await session.commit()
            
            return result.rowcount > 0


class SQLAlchemyTemplateRepository(TemplateRepository):
    """SQLAlchemy implementation of template repository"""
    
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self.session_factory = session_factory
    
    async def find_by_name(self, template_name: str) -> Optional[dict]:
        """Find template by name"""
        
        async with self.session_factory() as session:
            stmt = select(TemplateModel).where(
                TemplateModel.name == template_name,
                TemplateModel.active == True
            )
            result = await session.execute(stmt)
            template = result.scalar_one_or_none()
            
            if template:
                return {
                    'name': template.name,
                    'subject': template.subject,
                    'html_body': template.html_body,
                    'text_body': template.text_body
                }
            
            return None
    
    async def save_template(
        self, 
        name: str, 
        subject: str, 
        html_body: str, 
        text_body: Optional[str] = None
    ) -> bool:
        """Save or update email template"""
        
        async with self.session_factory() as session:
            # Check if template exists
            stmt = select(TemplateModel).where(TemplateModel.name == name)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                # Update existing
                stmt = update(TemplateModel).where(
                    TemplateModel.name == name
                ).values(
                    subject=subject,
                    html_body=html_body,
                    text_body=text_body,
                    updated_at=datetime.utcnow()
                )
                await session.execute(stmt)
            else:
                # Create new
                template = TemplateModel(
                    name=name,
                    subject=subject,
                    html_body=html_body,
                    text_body=text_body
                )
                session.add(template)
            
            await session.commit()
            return True


def create_database_engine(database_url: str):
    """Create database engine"""
    return create_async_engine(database_url, echo=False)


def create_session_factory(engine):
    """Create session factory"""
    return async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def create_tables(engine):
    """Create database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)