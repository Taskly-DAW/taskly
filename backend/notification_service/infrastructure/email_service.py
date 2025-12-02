"""
Infrastructure Layer - Email Service Implementation
SMTP email service implementation
"""

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
import logging
import os

from domain.services import EmailService
from domain.models import EmailNotification

logger = logging.getLogger(__name__)


class SMTPEmailService(EmailService):
    """SMTP implementation of email service"""
    
    def __init__(
        self,
        smtp_host: str,
        smtp_port: int,
        username: str,
        password: str,
        use_tls: bool = True,
        sender_email: Optional[str] = None,
        sender_name: Optional[str] = None
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        self.use_tls = use_tls
        self.sender_email = sender_email or username
        self.sender_name = sender_name or "Taskly Notifications"
    
    async def send_email(self, notification: EmailNotification) -> bool:
        """Send email notification via SMTP"""
        
        try:
            # Create message
            message = MIMEMultipart('alternative')
            message['Subject'] = notification.subject
            message['From'] = f"{self.sender_name} <{self.sender_email}>"
            message['To'] = notification.recipient_email
            
            # Add text part if available
            if notification.text_body:
                text_part = MIMEText(notification.text_body, 'plain')
                message.attach(text_part)
            
            # Add HTML part
            html_part = MIMEText(notification.html_body, 'html')
            message.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                start_tls=self.use_tls,
                username=self.username,
                password=self.password,
            )
            
            logger.info(f"Email sent successfully to {notification.recipient_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {notification.recipient_email}: {str(e)}")
            return False
    
    async def verify_connection(self) -> bool:
        """Verify SMTP server connection"""
        
        try:
            server = aiosmtplib.SMTP(hostname=self.smtp_host, port=self.smtp_port)
            await server.connect()
            
            if self.use_tls:
                await server.starttls()
            
            await server.login(self.username, self.password)
            await server.quit()
            
            logger.info("SMTP connection verified successfully")
            return True
            
        except Exception as e:
            logger.error(f"SMTP connection verification failed: {str(e)}")
            return False


def create_email_service() -> SMTPEmailService:
    """Factory function to create email service from environment variables"""
    
    smtp_host = os.getenv('SMTP_HOST', 'localhost')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    username = os.getenv('SMTP_USERNAME', '')
    password = os.getenv('SMTP_PASSWORD', '')
    use_tls = os.getenv('SMTP_USE_TLS', 'true').lower() == 'true'
    sender_email = os.getenv('SENDER_EMAIL', username)
    sender_name = os.getenv('SENDER_NAME', 'Taskly Notifications')
    
    return SMTPEmailService(
        smtp_host=smtp_host,
        smtp_port=smtp_port,
        username=username,
        password=password,
        use_tls=use_tls,
        sender_email=sender_email,
        sender_name=sender_name
    )