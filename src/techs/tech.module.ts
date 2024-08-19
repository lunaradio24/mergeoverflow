import { Module } from '@nestjs/common';
import { TechService } from './tech.service';
import { TechController } from './tech.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tech } from './entities/tech.entity';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tech, UserToTech])],
  controllers: [TechController],
  providers: [TechService],
  exports: [TypeOrmModule],
})
export class TechModule {}
