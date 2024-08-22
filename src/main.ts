import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerBuilder, swaggerOptions } from './configs/swagger.config';
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';
import { HttpErrorFilter } from './common/exception-filters/http-error.filter';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import passport from 'passport';
import { RedisIoAdapter } from './redis/adapter/socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(passport.initialize());
  app.useWebSocketAdapter(redisIoAdapter);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());

  const document = SwaggerModule.createDocument(app, swaggerBuilder);
  SwaggerModule.setup('api', app, document, swaggerOptions);

  await app.listen(port);
}

bootstrap();
