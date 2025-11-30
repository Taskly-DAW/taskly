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
            "user_id": user_id,
            "tenant_id": tenant_id,
            "user_email": event.get("username", f"user{user_id}@example.com"),
            "user_name": event.get("username", f"User {user_id}"),
            "registration_date": event.get("created_at", time.strftime('%Y-%m-%d %H:%M:%S')),
            "platform_name": "Taskly",
            "support_email": "support@taskly.com",
            "timestamp": time.time()
        }
        
        future = producer.send("user.events", value=welcome_event, key="user.welcome")
        producer.flush()  # Wait for the message to be sent
        logger.info(f"🎉 Welcome workflow initiated for user: {user_id}")
        
    except Exception as e:
        logger.error(f"❌ Error handling user.registered: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")