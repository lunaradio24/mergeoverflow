import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from './users/users.module';
import { MatchingModule } from './matchings/matchings.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { validationSchema } from './configs/validation.config';
import { typeOrmModuleOptions } from './configs/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { mailerModuleOptions } from './configs/mailer.config';
import { InterestModule } from './interest/interest.module';
import { TechModule } from './tech/tech.module';
import { SmsModule } from './auth/sms/sms.module';
import { S3Module } from './s3/s3.module';
import { MatchingPreferencesModule } from './matchings/matching-preferences.module';
import { Heart } from './matchings/entities/heart.entity';
import { HeartResetController } from './matchings/heart-reset.controller';
import { HeartResetService } from './matchings/heart-reset.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageModule } from './images/image.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정
      validationSchema: validationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    MailerModule.forRootAsync(mailerModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    TypeOrmModule.forFeature([Heart]),
    AuthModule,
    UsersModule,
    MatchingModule,
    MatchingPreferencesModule,
    ChatRoomsModule,
    NotificationsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      serveRoot: '/',
    }),
    InterestModule,
    TechModule,
    SmsModule,
    S3Module,
    ImageModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, HeartResetController],
  providers: [AppService, HeartResetService],
})
export class AppModule {}
