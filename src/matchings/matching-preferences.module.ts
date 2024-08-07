import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingPreferencesService } from './matching-preferences.service';
import { MatchingPreferencesController } from './matching-preferences.controller';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { User } from '../users/entities/user.entity';
import { MatchingModule } from './matching.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingPreferences, User]), MatchingModule],
  controllers: [MatchingPreferencesController],
  providers: [MatchingPreferencesService],
})
export class MatchingPreferencesModule {}
