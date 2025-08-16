// Kafka configuration interface
export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
    password: string;
  };
}
