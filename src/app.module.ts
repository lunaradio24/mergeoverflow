import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './users/user.module';
import { MatchingModule } from './matchings/matching.module';
import { ChatRoomModule } from './chat-rooms/chat-room.module';
import { NotificationModule } from './notifications/notification.module';
import { validationSchema } from './configs/validation.config';
import { typeOrmModuleOptions } from './configs/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { mailerModuleOptions } from './configs/mailer.config';
import { InterestModule } from './interests/interest.module';
import { TechModule } from './techs/tech.module';
import { SmsModule } from './sms/sms.module';
import { S3Module } from './s3/s3.module';
import { MatchingPreferencesModule } from './matchings/matching-preferences.module';
import { ImageModule } from './images/image.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LocationModule } from './locations/location.module';
import { HeartModule } from './hearts/heart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정
      validationSchema: validationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'), // static 폴더를 가리키도록 설정
      serveRoot: '/', // 정적 파일의 접근 경로 설정
    }),
    MailerModule.forRootAsync(mailerModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    MatchingModule,
    MatchingPreferencesModule,
    ChatRoomModule,
    NotificationModule,
    InterestModule,
    TechModule,
    SmsModule,
    S3Module,
    ImageModule,
    HeartModule,
    LocationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
