import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { AppModule } from '../src/app.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from 'src/users/entities/user.entity';
import { UserToInterest } from 'src/users/entities/user-to-interest.entity';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { Tech } from 'src/techs/entities/tech.entity';
import { Interest } from 'src/interests/entities/interest.entity';
import { ProfileImage } from 'src/images/entities/profile-image.entity';
import { Account } from 'src/auth/entities/account.entity';
import { ChatMessage } from 'src/chat-rooms/entities/chat-message.entity';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { Heart } from 'src/hearts/entities/heart.entity';
import { Matching } from 'src/matchings/entities/matching.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Preferences } from 'src/preferences/entities/preferences.entity';
import { accountFactory } from './factories/account.factory';
import { userFactory } from './factories/user.factory';
import { profileImageFactory } from './factories/profile-image.factory';
import { locationFactory } from './factories/location.factory';
import { preferenceFactory } from './factories/preference.factory';
import AccountSeeder from './seeders/account.seeder';
import UserSeeder from './seeders/user.seeder';
import ProfileImageSeeder from './seeders/profile-image.seeder';
import InterestSeeder from './seeders/interest.seeder';
import TechSeeder from './seeders/tech.seeder';
import UserToInterestSeeder from './seeders/user-to-interest.seeder';
import UserToTechSeeder from './seeders/user-to-tech.seeder';
import HeartSeeder from './seeders/heart.seeder';
import LocationSeeder from './seeders/location.seeder';
import PreferenceSeeder from './seeders/preference.seeder';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  const options: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: configService.get<boolean>('DB_SYNC'),
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      Account,
      User,
      UserToInterest,
      UserToTech,
      Interest,
      Tech,
      ProfileImage,
      ChatMessage,
      ChatRoom,
      Heart,
      Matching,
      Notification,
      Preferences,
      Location,
    ],
    seeds: [
      AccountSeeder,
      UserSeeder,
      ProfileImageSeeder,
      InterestSeeder,
      TechSeeder,
      UserToInterestSeeder,
      UserToTechSeeder,
      HeartSeeder,
      LocationSeeder,
      PreferenceSeeder,
    ],
    factories: [accountFactory, userFactory, profileImageFactory, locationFactory, preferenceFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  // Run seeders in order
  await runSeeders(dataSource, { seeds: [AccountSeeder] });
  await runSeeders(dataSource, { seeds: [UserSeeder] });
  await runSeeders(dataSource, { seeds: [ProfileImageSeeder, HeartSeeder, LocationSeeder, PreferenceSeeder] });
  await runSeeders(dataSource, { seeds: [InterestSeeder, TechSeeder] });
  await runSeeders(dataSource, { seeds: [UserToInterestSeeder, UserToTechSeeder] });

  console.log('Seeding completed');
  await app.close();
  process.exit();
})();
