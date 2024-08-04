import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Module } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Location])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
