"""
Use Cases Layer - Event Processing
Handle Kafka events and trigger appropriate notifications
"""

from typing import Dict, Any
import json
import logging

from domain.models import Priority
from use_cases.email_notifications import SendEmailNotificationUseCase

logger = logging.getLogger(__name__)


class ProcessKafkaEventUseCase:
    """Use case for processing Kafka events and triggering notifications"""
    
    def __init__(self, send_email_use_case: SendEmailNotificationUseCase):
        self.send_email_use_case = send_email_use_case
        
        # Event handler mapping
        self.event_handlers = {
            'user.welcome': self._handle_user_welcome,
            'user.password_reset': self._handle_password_reset,
            'user.email_verification': self._handle_email_verification,
            'system.maintenance': self._handle_system_maintenance,
        }
    
    async def execute(self, event_type: str, event_data: Dict[str, Any]) -> bool:
        """Process Kafka event and trigger appropriate notification"""
        
        try:
            if event_type not in self.event_handlers:
                logger.warning(f"No handler for event type: {event_type}")
                return False
            
            handler = self.event_handlers[event_type]
            await handler(event_data)
            
            logger.info(f"Successfully processed event: {event_type}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing event {event_type}: {str(e)}")
            return False
    
    async def _handle_user_welcome(self, event_data: Dict[str, Any]):
        """Handle user welcome event"""
        
        tenant_id = event_data.get('tenant_id', 'default')
        user_email = event_data['user_email']
        user_name = event_data.get('user_name', 'User')
        
        context_data = {
            'user_id': event_data.get('user_id'),
            'registration_date': event_data.get('registration_date'),
            'platform_name': event_data.get('platform_name', 'Taskly'),
            'support_email': event_data.get('support_email', 'support@taskly.com')
        }
        
        await self.send_email_use_case.execute(
            tenant_id=tenant_id,
            recipient_email=user_email,
            template_name='user_welcome',
            context_data=context_data,
            recipient_name=user_name,
            priority=Priority.NORMAL
        )
    
    async def _handle_password_reset(self, event_data: Dict[str, Any]):
        """Handle password reset event"""
        
        tenant_id = event_data.get('tenant_id', 'default')
        user_email = event_data['user_email']
        user_name = event_data.get('user_name', 'User')
        
        context_data = {
            'user_id': event_data.get('user_id'),
            'reset_token': event_data['reset_token'],
            'reset_url': event_data['reset_url'],
            'expiry_time': event_data.get('expiry_time', '24 hours'),
            'platform_name': event_data.get('platform_name', 'Taskly')
        }
        
        await self.send_email_use_case.execute(
            tenant_id=tenant_id,
            recipient_email=user_email,
            template_name='password_reset',
            context_data=context_data,
            recipient_name=user_name,
            priority=Priority.HIGH
        )
    
    async def _handle_email_verification(self, event_data: Dict[str, Any]):
        """Handle email verification event"""
        
        tenant_id = event_data.get('tenant_id', 'default')
        user_email = event_data['user_email']
        user_name = event_data.get('user_name', 'User')
        
        context_data = {
            'user_id': event_data.get('user_id'),
            'verification_token': event_data['verification_token'],
            'verification_url': event_data['verification_url'],
            'expiry_time': event_data.get('expiry_time', '48 hours'),
            'platform_name': event_data.get('platform_name', 'Taskly')
        }
        
        await self.send_email_use_case.execute(
            tenant_id=tenant_id,
            recipient_email=user_email,
            template_name='email_verification',
            context_data=context_data,
            recipient_name=user_name,
            priority=Priority.HIGH
        )
    
    async def _handle_system_maintenance(self, event_data: Dict[str, Any]):
        """Handle system maintenance notification"""
        
        tenant_id = event_data.get('tenant_id', 'default')
        
        # System maintenance can be sent to multiple recipients
        recipients = event_data.get('recipients', [])
        
        context_data = {
            'maintenance_start': event_data['maintenance_start'],
            'maintenance_end': event_data['maintenance_end'],
            'maintenance_reason': event_data.get('maintenance_reason', 'Scheduled maintenance'),
            'platform_name': event_data.get('platform_name', 'Taskly'),
            'status_page': event_data.get('status_page', 'https://status.taskly.com')
        }
        
        for recipient in recipients:
            await self.send_email_use_case.execute(
                tenant_id=tenant_id,
                recipient_email=recipient['email'],
                template_name='system_maintenance',
                context_data=context_data,
                recipient_name=recipient.get('name', 'User'),
                priority=Priority.URGENT
            )