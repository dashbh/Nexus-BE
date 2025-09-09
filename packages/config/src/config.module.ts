import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'staging', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        GATEWAY_PORT: Joi.number().optional(),
        FINDATA_PORT: Joi.number().optional(),
        TRADING_PORT: Joi.number().optional(),
        NOTIFICATION_PORT: Joi.number().optional(),
        FINDATA_HOST: Joi.string().optional(),
        TRADING_HOST: Joi.string().optional(),
        NOTIFICATION_HOST: Joi.string().optional(),
        DATABASE_URL: Joi.string().optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  exports: [ConfigModule],
})
export class NexusConfigModule { }

function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = `.env.${nodeEnv}`;
  const fallbackFile = '.env';

  // Check if environment-specific file exists
  if (fs.existsSync(path.resolve(process.cwd(), envFile))) {
    return envFile;
  }

  // Fallback to .env
  return fallbackFile;
}