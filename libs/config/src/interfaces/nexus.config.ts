// Main Nexus configuration interface
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { RedisConfig } from './redis.config';
import { KafkaConfig } from './kafka.config';
import { JwtConfig } from './jwt.config';

export interface NexusConfig {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  kafka: KafkaConfig;
  jwt: JwtConfig;
}
