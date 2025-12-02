"""
Infrastructure Layer - Template Engine Implementation
Jinja2 template engine implementation
"""

from typing import Dict, Any
import jinja2
import logging

from domain.services import TemplateEngine

logger = logging.getLogger(__name__)


class Jinja2TemplateEngine(TemplateEngine):
    """Jinja2 implementation of template engine"""
    
    def __init__(self):
        self.env = jinja2.Environment(
            loader=jinja2.BaseLoader(),
            autoescape=jinja2.select_autoescape(['html', 'xml']),
            trim_blocks=True,
            lstrip_blocks=True
        )
        
        # Add custom filters
        self.env.filters['datetime_format'] = self._datetime_filter
        self.env.filters['currency'] = self._currency_filter
    
    def render_template(self, template_content: str, context: Dict[str, Any]) -> str:
        """Render template with given context"""
        
        try:
            template = self.env.from_string(template_content)
            return template.render(**context)
            
        except jinja2.TemplateError as e:
            logger.error(f"Template rendering error: {str(e)}")
            raise ValueError(f"Template rendering failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in template rendering: {str(e)}")
            raise
    
    def render_subject(self, subject_template: str, context: Dict[str, Any]) -> str:
        """Render email subject with context"""
        
        try:
            template = self.env.from_string(subject_template)
            rendered = template.render(**context)
            
            # Clean up subject line (remove line breaks, extra spaces)
            return ' '.join(rendered.split())
            
        except jinja2.TemplateError as e:
            logger.error(f"Subject template rendering error: {str(e)}")
            raise ValueError(f"Subject template rendering failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in subject rendering: {str(e)}")
            raise
    
    def _datetime_filter(self, datetime_obj, format_string='%Y-%m-%d %H:%M:%S'):
        """Custom datetime filter for templates"""
        if datetime_obj is None:
            return ''
        return datetime_obj.strftime(format_string)
    
    def _currency_filter(self, amount, currency='USD'):
        """Custom currency filter for templates"""
        if amount is None:
            return ''
        return f"{currency} {amount:.2f}"


def create_template_engine() -> Jinja2TemplateEngine:
    """Factory function to create template engine"""
    return Jinja2TemplateEngine()