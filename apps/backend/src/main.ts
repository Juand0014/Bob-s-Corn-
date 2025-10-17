import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const serverConfig = ConfigService.getServerConfig();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [serverConfig.corsOrigin],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Bob's Corn API")
    .setDescription('API for purchasing corn with rate limiting')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverConfig.port);

  logger.log(
    `Bob's Corn Server running on http://localhost:${serverConfig.port}`,
  );
  logger.log(
    `Swagger API Documentation: http://localhost:${serverConfig.port}/api`,
  );
}

void bootstrap();
