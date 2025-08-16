import { NestFactory } from '@nestjs/core';
import { GatewaySvcModule } from './gateway-svc.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewaySvcModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
