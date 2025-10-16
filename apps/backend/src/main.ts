import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Bob's Corn API")
    .setDescription("API documentation for Bob's Corn application")
    .setVersion('1.0')
    .addTag('app', 'Application endpoints')
    .addServer('http://localhost:3001', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: "Bob's Corn API Documentation",
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
