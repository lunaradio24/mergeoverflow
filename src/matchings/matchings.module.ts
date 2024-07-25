import { Module } from '@nestjs/common';
import { MatchingsService } from './matchings.service';
import { MatchingsController } from './matchings.controller';

@Module({
  controllers: [MatchingsController],
  providers: [MatchingsService],
})
export class MatchingsModule {}
