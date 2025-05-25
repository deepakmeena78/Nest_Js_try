import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastifyMultipart from '@fastify/multipart';
import * as fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // ✅ Enable Multipart (For File Uploads)
  app.register(fastifyMultipart);

  // ✅ Serve Uploaded Files Publicly
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/', // Files accessible via /uploads/{filename}
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    '🚀 Server started at http://localhost:' + (process.env.PORT ?? 3000),
  );
}
bootstrap();
