import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nexus/config';

async function bootstrap() {
  // Create a temporary app context to get config
  const tempApp = await NestFactory.create(AppModule);
  const configService = tempApp.get(ConfigService);
  const port = configService.get<number>('NOTIFICATION_PORT') || 3003;
  await tempApp.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: port,
      },
    },
  );
  
  await app.listen();
  console.log(`🚀 ${configService.get('NODE_ENV')} mode on port ${port}`);
}
void bootstrap();
