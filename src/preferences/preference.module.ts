import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { Preferences } from './entities/preferences.entity';
import { MatchingModule } from '../matchings/matching.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Preferences]), MatchingModule, UserModule],
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferenceModule {}
