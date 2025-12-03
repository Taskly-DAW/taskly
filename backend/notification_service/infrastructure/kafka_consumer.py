"""
Infrastructure Layer - Kafka Consumer Implementation
Consumer for processing Kafka events
"""

import asyncio
import json
import logging
from typing import Callable, Dict, Any
from kafka import KafkaConsumer
from kafka.errors import KafkaError

logger = logging.getLogger(__name__)


class KafkaEventConsumer:
    """Kafka consumer for processing notification events"""
    
    def __init__(
        self,
        bootstrap_servers: str,
        group_id: str,
        topics: list[str],
        event_handler: Callable[[str, Dict[str, Any]], bool]
    ):
        self.bootstrap_servers = bootstrap_servers
        self.group_id = group_id
        self.topics = topics
        self.event_handler = event_handler
        self.consumer = None
        self.running = False
    
    async def start_consumer(self):
        """Start consuming Kafka messages asynchronously"""
        
        try:
            self.consumer = KafkaConsumer(
                *self.topics,
                bootstrap_servers=self.bootstrap_servers,
                group_id=self.group_id,
                value_deserializer=lambda x: json.loads(x.decode('utf-8')),
                key_deserializer=lambda x: x.decode('utf-8') if x else None,
                auto_offset_reset='earliest',
                enable_auto_commit=True,
                consumer_timeout_ms=1000
            )
            
            self.running = True
            logger.info(f"Started Kafka consumer for topics: {self.topics}")
            
            while self.running:
                try:
                    # Run blocking poll in thread to avoid blocking event loop
                    message_batch = await asyncio.to_thread(self.consumer.poll, timeout_ms=1000)
                    
                    if message_batch:
                        logger.info(f"📨 Received {len(message_batch)} message batch(es)")
                    
                    for topic_partition, messages in message_batch.items():
                        logger.info(f"📧 Processing {len(messages)} messages from {topic_partition.topic}")
                        for message in messages:
                            await self._process_message(message)
                            
                except KafkaError as e:
                    logger.error(f"Kafka error: {str(e)}")
                except Exception as e:
                    logger.error(f"Error processing messages: {str(e)}")
                    
                # Small delay to prevent tight loop
                await asyncio.sleep(0.1)
        
        except Exception as e:
            logger.error(f"Failed to start Kafka consumer: {str(e)}")
            raise
    
    async def _process_message(self, message):
        """Process individual Kafka message"""
        
        try:
            event_type = message.key or "unknown"
            event_data = message.value
            
            logger.info(f"Processing event: {event_type}")
            logger.debug(f"Event data: {event_data}")
            
            # Call the event handler
            success = await self.event_handler(event_type, event_data)
            
            if success:
                logger.info(f"Successfully processed event: {event_type}")
            else:
                logger.warning(f"Event processing returned false: {event_type}")
                
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            # In production, you might want to send to a dead letter queue
    
    async def stop_consumer(self):
        """Stop the Kafka consumer"""
        
        self.running = False
        if self.consumer:
            await asyncio.to_thread(self.consumer.close)
        logger.info("Kafka consumer stopped")


class KafkaEventPublisher:
    """Kafka producer for publishing notification events"""
    
    def __init__(self, bootstrap_servers: str):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None
    
    def _get_producer(self):
        """Get or create Kafka producer"""
        
        if not self.producer:
            from kafka import KafkaProducer
            
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda x: json.dumps(x).encode('utf-8'),
                key_serializer=lambda x: x.encode('utf-8') if x else None
            )
        
        return self.producer
    
    async def publish_event(self, topic: str, event_type: str, event_data: Dict[str, Any]) -> bool:
        """Publish event to Kafka topic"""
        
        try:
            producer = self._get_producer()
            
            future = producer.send(
                topic=topic,
                key=event_type,
                value=event_data
            )
            
            # Wait for the message to be sent
            producer.flush()
            
            logger.info(f"Published event {event_type} to topic {topic}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to publish event {event_type}: {str(e)}")
            return False
    
    def close(self):
        """Close the Kafka producer"""
        
        if self.producer:
            self.producer.close()
            logger.info("Kafka producer closed")