import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Heart } from './entities/heart.entity';
import { HeartController } from './heart.controller';
import { HeartService } from './heart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Heart])],
  controllers: [HeartController],
  providers: [HeartService],
  exports: [HeartService],
})
export class HeartModule {}
