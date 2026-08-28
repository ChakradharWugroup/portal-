import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPaths = [
    path.resolve(process.cwd(), '../.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env')
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
          line = line.trim();
          if (!line || line.startsWith('#')) return;
          const index = line.indexOf('=');
          if (index !== -1) {
            const key = line.substring(0, index).trim();
            let val = line.substring(index + 1).trim();
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1);
            }
            if (val.startsWith("'") && val.endsWith("'")) {
              val = val.substring(1, val.length - 1);
            }
            process.env[key] = val;
          }
        });
        break;
      } catch (e) {
        console.error(`Error loading env file: ${e.message}`);
      }
    }
  }
}
loadEnv();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Cotton Republic Enterprise API')
    .setDescription('Interactive OpenAPI documentation for the Smart Enterprise Platform backend services.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 6432;
  await app.listen(port);
  logger.log(`NestJS Server running on: http://localhost:${port}`);
  logger.log(`Swagger Web Documentation live on: http://localhost:${port}/api/docs`);
}
bootstrap();
