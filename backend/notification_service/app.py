"""
Main Application Entry Point
FastAPI application with dependency injection
"""

import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Infrastructure
from infrastructure.repositories import (
    create_database_engine,
    create_session_factory,
    create_tables,
    SQLAlchemyNotificationRepository,
    SQLAlchemyTemplateRepository
)
from infrastructure.email_service import create_email_service
from infrastructure.template_engine import create_template_engine
from infrastructure.kafka_consumer import KafkaEventConsumer, KafkaEventPublisher
from infrastructure.event_publisher import KafkaDomainEventPublisher

# Use Cases
from use_cases.email_notifications import (
    SendEmailNotificationUseCase,
    ProcessPendingNotificationsUseCase,
    RetryFailedNotificationsUseCase
)
from use_cases.event_processing import ProcessKafkaEventUseCase

# Domain
from domain.models import Priority

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DIContainer:
    """Dependency injection container"""
    
    def __init__(self):
        self.session_factory = None
        self.notification_repository = None
        self.template_repository = None
        self.email_service = None
        self.template_engine = None
        self.kafka_publisher = None
        self.event_publisher = None
        self.send_email_use_case = None
        self.process_pending_use_case = None
        self.retry_failed_use_case = None
        self.process_kafka_event_use_case = None
        self.kafka_consumer = None
    
    async def initialize(self):
        """Initialize all dependencies"""
        
        # Database
        database_url = os.getenv(
            'DATABASE_URL', 
            'postgresql+asyncpg://notification_user:notification_pass@postgres:5432/taskly_notifications'
        )
        engine = create_database_engine(database_url)
        await create_tables(engine)
        self.session_factory = create_session_factory(engine)
        
        # Repositories
        self.notification_repository = SQLAlchemyNotificationRepository(self.session_factory)
        self.template_repository = SQLAlchemyTemplateRepository(self.session_factory)
        
        # Services
        self.email_service = create_email_service()
        self.template_engine = create_template_engine()
        
        # Kafka
        kafka_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'redpanda:9092')
        self.kafka_publisher = KafkaEventPublisher(kafka_servers)
        self.event_publisher = KafkaDomainEventPublisher(self.kafka_publisher)
        
        # Use Cases
        self.send_email_use_case = SendEmailNotificationUseCase(
            self.notification_repository,
            self.template_repository,
            self.email_service,
            self.template_engine,
            self.event_publisher
        )
        
        self.process_pending_use_case = ProcessPendingNotificationsUseCase(
            self.notification_repository,
            self.email_service,
            self.event_publisher
        )
        
        self.retry_failed_use_case = RetryFailedNotificationsUseCase(
            self.notification_repository,
            self.email_service,
            self.event_publisher
        )
        
        self.process_kafka_event_use_case = ProcessKafkaEventUseCase(
            self.send_email_use_case
        )
        
        # Initialize default templates
        await self._initialize_default_templates()
        
        # Start Kafka consumer
        await self._start_kafka_consumer()
        
        logger.info("Dependency injection container initialized")
    
    async def _initialize_default_templates(self):
        """Initialize default email templates"""
        
        default_templates = [
            {
                'name': 'user_welcome',
                'subject': 'Welcome to {{ platform_name }}, {{ user_name }}!',
                'html_body': '''
                <html>
                <body>
                    <h1>Welcome to {{ platform_name }}!</h1>
                    <p>Hi {{ user_name }},</p>
                    <p>Welcome to our platform! We're excited to have you on board.</p>
                    <p>Your registration was completed on {{ registration_date }}.</p>
                    <p>If you have any questions, please contact us at {{ support_email }}.</p>
                    <p>Best regards,<br>The {{ platform_name }} Team</p>
                </body>
                </html>
                ''',
                'text_body': '''
                Welcome to {{ platform_name }}!
                
                Hi {{ user_name }},
                
                Welcome to our platform! We're excited to have you on board.
                Your registration was completed on {{ registration_date }}.
                
                If you have any questions, please contact us at {{ support_email }}.
                
                Best regards,
                The {{ platform_name }} Team
                '''
            },
            {
                'name': 'password_reset',
                'subject': 'Password Reset Request - {{ platform_name }}',
                'html_body': '''
                <html>
                <body>
                    <h1>Password Reset Request</h1>
                    <p>Hi {{ user_name }},</p>
                    <p>You have requested to reset your password for {{ platform_name }}.</p>
                    <p>Please click the link below to reset your password:</p>
                    <p><a href="{{ reset_url }}">Reset Password</a></p>
                    <p>This link will expire in {{ expiry_time }}.</p>
                    <p>If you didn't request this reset, please ignore this email.</p>
                    <p>Best regards,<br>The {{ platform_name }} Team</p>
                </body>
                </html>
                ''',
                'text_body': '''
                Password Reset Request
                
                Hi {{ user_name }},
                
                You have requested to reset your password for {{ platform_name }}.
                Please visit the following link to reset your password:
                
                {{ reset_url }}
                
                This link will expire in {{ expiry_time }}.
                
                If you didn't request this reset, please ignore this email.
                
                Best regards,
                The {{ platform_name }} Team
                '''
            }
        ]
        
        for template in default_templates:
            await self.template_repository.save_template(
                name=template['name'],
                subject=template['subject'],
                html_body=template['html_body'],
                text_body=template['text_body']
            )
        
        logger.info("Default email templates initialized")
    
    async def _start_kafka_consumer(self):
        """Start Kafka consumer for processing events"""
        
        kafka_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'redpanda:9092')
        topics = ['user.events', 'system.events']
        
        self.kafka_consumer = KafkaEventConsumer(
            bootstrap_servers=kafka_servers,
            group_id='notification-service',
            topics=topics,
            event_handler=self.process_kafka_event_use_case.execute
        )
        
        # Start consumer as async task in the same event loop
        asyncio.create_task(self.kafka_consumer.start_consumer())
        
        logger.info("Kafka consumer started")
    
    async def cleanup(self):
        """Cleanup resources"""
        
        if self.kafka_consumer:
            await self.kafka_consumer.stop_consumer()
        
        if self.kafka_publisher:
            self.kafka_publisher.close()
        
        logger.info("Resources cleaned up")


# Global DI container
di_container = DIContainer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    
    # Startup
    await di_container.initialize()
    yield
    
    # Shutdown
    await di_container.cleanup()


# Create FastAPI app
app = FastAPI(
    title="Notification Service",
    description="Microservice for handling email notifications via Kafka events",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency injection
def get_send_email_use_case():
    return di_container.send_email_use_case

def get_process_pending_use_case():
    return di_container.process_pending_use_case

def get_retry_failed_use_case():
    return di_container.retry_failed_use_case


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    
    # Verify email service connection
    email_service_ok = await di_container.email_service.verify_connection()
    
    return {
        "status": "healthy" if email_service_ok else "degraded",
        "email_service": "ok" if email_service_ok else "error",
        "timestamp": "2024-01-01T00:00:00Z"  # This would be actual timestamp
    }


# Manual email sending endpoint (for testing)
@app.post("/send-email")
async def send_email_manual(
    tenant_id: str,
    recipient_email: str,
    template_name: str,
    context_data: dict,
    recipient_name: str = None,
    priority: Priority = Priority.NORMAL,
    send_email_use_case: SendEmailNotificationUseCase = Depends(get_send_email_use_case)
):
    """Manually send an email notification"""
    
    try:
        notification_id = await send_email_use_case.execute(
            tenant_id=tenant_id,
            recipient_email=recipient_email,
            template_name=template_name,
            context_data=context_data,
            recipient_name=recipient_name,
            priority=priority
        )
        
        return {"notification_id": notification_id, "status": "sent"}
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Process pending notifications endpoint
@app.post("/process-pending")
async def process_pending(
    batch_size: int = 100,
    process_use_case: ProcessPendingNotificationsUseCase = Depends(get_process_pending_use_case)
):
    """Process pending notifications"""
    
    try:
        processed_count = await process_use_case.execute(batch_size)
        return {"processed_count": processed_count}
        
    except Exception as e:
        logger.error(f"Failed to process pending notifications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Retry failed notifications endpoint
@app.post("/retry-failed")
async def retry_failed(
    batch_size: int = 50,
    retry_use_case: RetryFailedNotificationsUseCase = Depends(get_retry_failed_use_case)
):
    """Retry failed notifications"""
    
    try:
        retried_count = await retry_use_case.execute(batch_size)
        return {"retried_count": retried_count}
        
    except Exception as e:
        logger.error(f"Failed to retry failed notifications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)