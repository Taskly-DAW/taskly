"""
Domain Layer - Value Objects
Immutable objects that describe domain concepts
"""

from dataclasses import dataclass
from typing import Optional
import re


@dataclass(frozen=True)
class EmailAddress:
    """Value object for email addresses"""
    value: str
    
    def __post_init__(self):
        if not self.is_valid_email(self.value):
            raise ValueError(f"Invalid email address: {self.value}")
    
    @staticmethod
    def is_valid_email(email: str) -> bool:
        """Basic email validation"""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_pattern, email) is not None


@dataclass(frozen=True)
class Template:
    """Value object for email templates"""
    name: str
    subject_template: str
    html_template: str
    text_template: Optional[str] = None
    
    def __post_init__(self):
        if not self.name or not self.name.strip():
            raise ValueError("Template name cannot be empty")
        if not self.subject_template or not self.subject_template.strip():
            raise ValueError("Subject template cannot be empty")
        if not self.html_template or not self.html_template.strip():
            raise ValueError("HTML template cannot be empty")


@dataclass(frozen=True)
class TemplateContext:
    """Value object for template rendering context"""
    user_name: str
    user_email: str
    tenant_id: str
    additional_data: dict
    
    def get_context_dict(self) -> dict:
        """Get context as dictionary for template rendering"""
        return {
            'user_name': self.user_name,
            'user_email': self.user_email,
            'tenant_id': self.tenant_id,
            **self.additional_data
        }