import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development' ? '*' : ['/.petrus.dev.br$/'],
  });
  await app.listen(3456);
}
bootstrap();
