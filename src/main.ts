import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : /^(https:\/\/([^\.]*\.)?petrus\.dev\.br)$/i,
  });
  await app.listen(3456);
}
bootstrap();
