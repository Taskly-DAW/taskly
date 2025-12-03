import json
import logging
import time
from typing import Dict, Any
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable, KafkaError

logger = logging.getLogger(__name__)

class EventPublisher:
    def __init__(self, bootstrap_servers: str = "redpanda:9092"):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None
        self._connect()
    
    def _connect(self):
        """Connect to Kafka with retry logic"""
        max_retries = 5
        for attempt in range(max_retries):
            try:
                self.producer = KafkaProducer(
                    bootstrap_servers=self.bootstrap_servers,
                    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                    retries=3,
                    acks='all',
                    request_timeout_ms=30000
                )
                logger.info("✅ Event publisher connected to Kafka")
                return
            except NoBrokersAvailable:
                logger.warning(f"⏳ Kafka not available, retry {attempt + 1}/{max_retries}")
                time.sleep(2)
            except Exception as e:
                logger.error(f"❌ Error connecting to Kafka: {e}")
                time.sleep(2)
        
        logger.warning("⚠️ Could not connect to Kafka, events will not be published")
    
    def publish_user_registered(self, user_id: str, username: str, tenant_id: str):
        """Publish user.registered event"""
        event = {
            "type": "user.registered",
            "user_id": user_id,
            "username": username,
            "tenant_id": tenant_id,
            "timestamp": int(time.time()),
            "metadata": {
                "source": "auth_service",
                "version": "1.0"
            }
        }
        
        self._publish_event("user.registered", event)
    
    def _publish_event(self, topic: str, event: Dict[str, Any]):
        """Internal method to publish events"""
        if not self.producer:
            logger.warning("⚠️ No Kafka connection, event not published")
            return
        
        try:
            # Send event to Kafka
            future = self.producer.send(topic, value=event)
            
            # Wait for confirmation (optional - for reliability)
            record_metadata = future.get(timeout=10)
            
            logger.info(f"✅ Published event {event['type']} to topic {topic} "
                       f"(partition: {record_metadata.partition}, offset: {record_metadata.offset})")
            
        except KafkaError as e:
            logger.error(f"❌ Failed to publish event {event['type']}: {e}")
        except Exception as e:
            logger.error(f"❌ Unexpected error publishing event: {e}")
    
    def close(self):
        """Close the producer connection"""
        if self.producer:
            self.producer.flush()
            self.producer.close()
            logger.info("✅ Event publisher closed")

# Global instance
event_publisher = EventPublisher()