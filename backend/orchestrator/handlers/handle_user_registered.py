import logging
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def handle_user_registered(event, producer):
    """Handle user.registered event"""
    try:
        user_id = event.get("user_id")
        tenant_id = event.get("tenant_id")
        logger.info(f"👤 New user registered: {user_id} in tenant: {tenant_id}")
        
        # Send welcome workflow event
        welcome_event = {
            "type": "user.welcome",
            "user_id": user_id,
            "tenant_id": tenant_id,
            "timestamp": time.time()
        }
        
        producer.send("user.welcome", welcome_event)
        logger.info(f"🎉 Welcome workflow initiated for user: {user_id}")
        
    except Exception as e:
        logger.error(f"❌ Error handling user.registered: {e}")