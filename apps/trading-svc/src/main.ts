import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.TCP_PORT ?? '3003'),
    },
  });

  await app.listen();
  console.log('Trading microservice is listening on TCP port', process.env.TCP_PORT ?? '3003');
}

void bootstrap();
