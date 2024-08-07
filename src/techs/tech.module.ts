import { Module } from '@nestjs/common';
import { TechService } from './tech.service';
import { TechController } from './tech.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tech } from './entities/tech.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tech])],
  controllers: [TechController],
  providers: [TechService],
})
export class TechModule {}
