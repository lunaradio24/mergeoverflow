import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingPreferencesController } from './matching-preferences.controller';
import { MatchingPreferencesService } from './matching-preferences.service';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingPreferences, User])],
  controllers: [MatchingPreferencesController],
  providers: [MatchingPreferencesService],
})
export class MatchingPreferencesModule {}
