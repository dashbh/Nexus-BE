// Application configuration interface
export interface AppConfig {
  port: number;
  environment: string;
  corsOrigins: string[];
  rateLimitMax: number;
  rateLimitWindowMs: number;
  logLevel: string;
}
