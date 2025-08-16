// Kafka Topic Definitions
export const KAFKA_TOPICS = {
  USER_EVENTS: 'nexus.user.events',
  TRADING_EVENTS: 'nexus.trading.events',
  MARKET_DATA_EVENTS: 'nexus.market.events',
  NOTIFICATION_EVENTS: 'nexus.notification.events',
  SYSTEM_EVENTS: 'nexus.system.events',
  AUDIT_EVENTS: 'nexus.audit.events',
} as const;

export type KafkaTopicName = keyof typeof KAFKA_TOPICS;
