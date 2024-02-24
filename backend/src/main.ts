import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { ResponseHandlerInterceptor } from './helpers/ResponseHandlerInterceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // middlewares, express specific
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.setGlobalPrefix(`/api/${process.env.API_PREFIX}`);

  app.use(
    rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_TIME as string) * 60 * 1000, // 15 minutes
      max: parseInt(process.env.MAX_RATE_LIMIT as string), // limit each IP to 100 requests per windowMs
    }),
  );

  app.enableCors({
    origin: ['http://localhost:*'],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseHandlerInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // swagger integration
  const options = new DocumentBuilder()
    .setTitle('Aviation Service')
    .setDescription('Aviation service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api/${process.env.API_PREFIX}/swagger`, app, document);
  console.log(
    'Latest code has deployed  -----------------',
    process.env.APP_PORT,
  );

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
