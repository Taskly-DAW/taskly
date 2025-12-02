"""
Infrastructure Layer - Event Publisher Implementation
Kafka event publisher for domain events
"""

import logging
from domain.services import EventPublisher
from domain.models import EmailNotification
from infrastructure.kafka_consumer import KafkaEventPublisher

logger = logging.getLogger(__name__)


class KafkaDomainEventPublisher(EventPublisher):
    """Kafka implementation of domain event publisher"""
    
    def __init__(self, kafka_publisher: KafkaEventPublisher, events_topic: str = "notification.events"):
        self.kafka_publisher = kafka_publisher
        self.events_topic = events_topic
    
    async def publish_notification_sent(self, notification: EmailNotification) -> bool:
        """Publish notification sent event"""
        
        event_data = {
            'notification_id': notification.id,
            'tenant_id': notification.tenant_id,
            'recipient_email': notification.recipient_email,
            'recipient_name': notification.recipient_name,
            'subject': notification.subject,
            'sent_at': notification.sent_at.isoformat() if notification.sent_at else None,
            'priority': notification.priority.value,
            'metadata': notification.metadata or {}
        }
        
        return await self.kafka_publisher.publish_event(
            topic=self.events_topic,
            event_type='notification.sent',
            event_data=event_data
        )
    
    async def publish_notification_failed(self, notification: EmailNotification) -> bool:
        """Publish notification failed event"""
        
        event_data = {
            'notification_id': notification.id,
            'tenant_id': notification.tenant_id,
            'recipient_email': notification.recipient_email,
            'recipient_name': notification.recipient_name,
            'subject': notification.subject,
            'error_message': notification.error_message,
            'retry_count': notification.retry_count,
            'max_retries': notification.max_retries,
            'can_retry': notification.can_retry(),
            'priority': notification.priority.value,
            'metadata': notification.metadata or {}
        }
        
        return await self.kafka_publisher.publish_event(
            topic=self.events_topic,
            event_type='notification.failed',
            event_data=event_data
        )