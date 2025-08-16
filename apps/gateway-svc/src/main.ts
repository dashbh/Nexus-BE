import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GatewaySvcModule } from './gateway-svc.module';
import { ConfigService } from '@nexus/config';
import { LoggingService } from './infrastructure/logging/logging.service';
import * as http from 'http';

async function performHealthCheck(): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 3000,
      path: '/health',
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Health check failed with status ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Health check timeout'));
    });

    req.end();
  });
}

async function bootstrap() {
  // Check if this is a health check call
  if (process.argv.includes('--health-check')) {
    try {
      await performHealthCheck();
      process.exit(0);
    } catch (error) {
      console.error(
        'Health check failed:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      process.exit(1);
    }
  }

  const app = await NestFactory.create(GatewaySvcModule);

  const configService = app.get(ConfigService);
  const loggingService = app.get(LoggingService);

  // Use custom logger
  app.useLogger(loggingService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure CORS
  const appConfig = configService.get('app');
  app.enableCors({
    origin: appConfig.corsOrigins,
    credentials: true,
  });

  // TODO: Configure microservices transport for Kafka when needed
  // const kafkaConfig = configService.get('kafka');
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: kafkaConfig.clientId,
  //       brokers: kafkaConfig.brokers,
  //     },
  //     consumer: {
  //       groupId: kafkaConfig.groupId,
  //     },
  //   },
  // });

  // Start microservices
  // await app.startAllMicroservices();

  // Start HTTP server
  const port = appConfig.port;
  await app.listen(port);

  loggingService.log(`Gateway service started on port ${port}`, 'Bootstrap');

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    loggingService.log(
      'Received SIGTERM, shutting down gracefully',
      'Bootstrap',
    );
    void app.close().then(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    loggingService.log(
      'Received SIGINT, shutting down gracefully',
      'Bootstrap',
    );
    void app.close().then(() => process.exit(0));
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
