"""
Use Cases Layer - Business Logic Implementation
Contains the application-specific business rules
"""

from typing import Optional, Dict, Any
from uuid import uuid4
from datetime import datetime

from domain.models import EmailNotification, Priority, NotificationStatus
from domain.value_objects import EmailAddress, Template, TemplateContext
from domain.repositories import NotificationRepository, TemplateRepository
from domain.services import EmailService, TemplateEngine, EventPublisher


class SendEmailNotificationUseCase:
    """Use case for sending email notifications"""
    
    def __init__(
        self,
        notification_repository: NotificationRepository,
        template_repository: TemplateRepository,
        email_service: EmailService,
        template_engine: TemplateEngine,
        event_publisher: EventPublisher
    ):
        self.notification_repository = notification_repository
        self.template_repository = template_repository
        self.email_service = email_service
        self.template_engine = template_engine
        self.event_publisher = event_publisher
    
    async def execute(
        self,
        tenant_id: str,
        recipient_email: str,
        template_name: str,
        context_data: Dict[str, Any],
        recipient_name: Optional[str] = None,
        priority: Priority = Priority.NORMAL
    ) -> str:
        """Execute the send email notification use case"""
        
        # Validate email address
        email_address = EmailAddress(recipient_email)
        
        # Get template
        template_data = await self.template_repository.find_by_name(template_name)
        if not template_data:
            raise ValueError(f"Template '{template_name}' not found")
        
        template = Template(
            name=template_name,
            subject_template=template_data['subject'],
            html_template=template_data['html_body'],
            text_template=template_data.get('text_body')
        )
        
        # Create template context
        template_context = TemplateContext(
            user_name=recipient_name or "User",
            user_email=recipient_email,
            tenant_id=tenant_id,
            additional_data=context_data
        )
        
        # Render template
        subject = self.template_engine.render_subject(
            template.subject_template, 
            template_context.get_context_dict()
        )
        html_body = self.template_engine.render_template(
            template.html_template,
            template_context.get_context_dict()
        )
        
        text_body = None
        if template.text_template:
            text_body = self.template_engine.render_template(
                template.text_template,
                template_context.get_context_dict()
            )
        
        # Create notification
        notification = EmailNotification(
            id=str(uuid4()),
            tenant_id=tenant_id,
            recipient_email=recipient_email,
            recipient_name=recipient_name,
            subject=subject,
            html_body=html_body,
            text_body=text_body,
            priority=priority,
            metadata={'template_name': template_name, **context_data}
        )
        
        # Save notification
        await self.notification_repository.save(notification)
        
        # Send email
        try:
            success = await self.email_service.send_email(notification)
            if success:
                notification.mark_as_sent()
                await self.notification_repository.save(notification)
                await self.event_publisher.publish_notification_sent(notification)
            else:
                notification.mark_as_failed("Failed to send email")
                await self.notification_repository.save(notification)
                await self.event_publisher.publish_notification_failed(notification)
        except Exception as e:
            notification.mark_as_failed(str(e))
            await self.notification_repository.save(notification)
            await self.event_publisher.publish_notification_failed(notification)
            raise
        
        return notification.id


class ProcessPendingNotificationsUseCase:
    """Use case for processing pending notifications"""
    
    def __init__(
        self,
        notification_repository: NotificationRepository,
        email_service: EmailService,
        event_publisher: EventPublisher
    ):
        self.notification_repository = notification_repository
        self.email_service = email_service
        self.event_publisher = event_publisher
    
    async def execute(self, batch_size: int = 100) -> int:
        """Process pending notifications"""
        
        pending_notifications = await self.notification_repository.find_pending(batch_size)
        processed_count = 0
        
        for notification in pending_notifications:
            try:
                success = await self.email_service.send_email(notification)
                if success:
                    notification.mark_as_sent()
                    await self.event_publisher.publish_notification_sent(notification)
                else:
                    notification.mark_as_failed("Failed to send email")
                    await self.event_publisher.publish_notification_failed(notification)
                
                await self.notification_repository.save(notification)
                processed_count += 1
                
            except Exception as e:
                notification.mark_as_failed(str(e))
                await self.notification_repository.save(notification)
                await self.event_publisher.publish_notification_failed(notification)
        
        return processed_count


class RetryFailedNotificationsUseCase:
    """Use case for retrying failed notifications"""
    
    def __init__(
        self,
        notification_repository: NotificationRepository,
        email_service: EmailService,
        event_publisher: EventPublisher
    ):
        self.notification_repository = notification_repository
        self.email_service = email_service
        self.event_publisher = event_publisher
    
    async def execute(self, batch_size: int = 50) -> int:
        """Retry failed notifications that can be retried"""
        
        retryable_notifications = await self.notification_repository.find_failed_retryable(batch_size)
        retried_count = 0
        
        for notification in retryable_notifications:
            if notification.can_retry():
                notification.increment_retry()
                
                try:
                    success = await self.email_service.send_email(notification)
                    if success:
                        notification.mark_as_sent()
                        await self.event_publisher.publish_notification_sent(notification)
                    else:
                        notification.mark_as_failed(f"Retry {notification.retry_count} failed")
                        await self.event_publisher.publish_notification_failed(notification)
                    
                    await self.notification_repository.save(notification)
                    retried_count += 1
                    
                except Exception as e:
                    notification.mark_as_failed(f"Retry {notification.retry_count} failed: {str(e)}")
                    await self.notification_repository.save(notification)
                    await self.event_publisher.publish_notification_failed(notification)
        
        return retried_count