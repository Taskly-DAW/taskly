#!/usr/bin/env python3
"""
Orchestrator Service for Taskly
Handles event orchestration between microservices using Kafka/Redpanda
"""

import json
import logging
import time
import sys
from kafka import KafkaConsumer, KafkaProducer
from kafka.errors import NoBrokersAvailable, KafkaError

# Import handlers directly
from handlers.handle_user_registered import handle_user_registered

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def wait_for_kafka(bootstrap_servers, max_retries=30, retry_interval=2):
    """Wait for Kafka to be available"""
    for attempt in range(max_retries):
        try:
            # Test connection by creating a temporary consumer
            test_consumer = KafkaConsumer(
                bootstrap_servers=bootstrap_servers, consumer_timeout_ms=1000
            )
            test_consumer.close()
            logger.info("✅ Kafka connection established")
            return True
        except NoBrokersAvailable:
            logger.warning(
                f"⏳ Waiting for Kafka... (attempt {attempt + 1}/{max_retries})"
            )
            time.sleep(retry_interval)
        except Exception as e:
            logger.error(f"❌ Unexpected error connecting to Kafka: {e}")
            time.sleep(retry_interval)

    logger.error(f"❌ Failed to connect to Kafka after {max_retries} attempts")
    return False


def create_consumer_producer(bootstrap_servers):
    """Create Kafka consumer and producer"""
    try:
        consumer = KafkaConsumer(
            "user.registered",
            bootstrap_servers=bootstrap_servers,
            group_id="orchestrator-group",
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            auto_offset_reset="latest",
            enable_auto_commit=True,
        )

        producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            retries=3,
            acks="all",
        )

        return consumer, producer
    except Exception as e:
        logger.error(f"❌ Failed to create consumer/producer: {e}")
        return None, None


def main():
    """Main orchestrator loop"""
    logger.info("🚀 Starting Taskly Orchestrator...")

    bootstrap_servers = "redpanda:9092"

    # Wait for Kafka to be available
    if not wait_for_kafka(bootstrap_servers):
        logger.error("❌ Cannot connect to Kafka. Exiting.")
        sys.exit(1)

    # Create consumer and producer
    consumer, producer = create_consumer_producer(bootstrap_servers)
    if not consumer or not producer:
        logger.error("❌ Failed to create Kafka clients. Exiting.")
        sys.exit(1)

    logger.info("✅ Orchestrator ready - listening for events...")

    try:
        # Main event processing loop
        for message in consumer:
            try:
                event = message.value
                event_type = event.get("type", "unknown")

                logger.info(f"📨 Received event: {event_type}")

                # Route events to appropriate handlers
                if event_type == "user.registered":
                    handle_user_registered(event, producer)
                else:
                    logger.warning(f"⚠️ Unhandled event type: {event_type}")

                # Flush producer to ensure messages are sent
                producer.flush()

            except json.JSONDecodeError as e:
                logger.error(f"❌ Invalid JSON in message: {e}")
            except Exception as e:
                logger.error(f"❌ Error processing message: {e}")

    except KeyboardInterrupt:
        logger.info("🛑 Orchestrator shutdown requested")
    except Exception as e:
        logger.error(f"❌ Fatal error in orchestrator: {e}")
    finally:
        # Cleanup
        try:
            consumer.close()
            producer.close()
            logger.info("✅ Orchestrator shutdown complete")
        except Exception as e:
            logger.error(f"❌ Error during cleanup: {e}")


if __name__ == "__main__":
    main()
