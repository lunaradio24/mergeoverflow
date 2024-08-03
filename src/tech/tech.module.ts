import { Module } from '@nestjs/common';
import { TechService } from './tech.service';
import { TechController } from './tech.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tech } from './entities/tech.entity';
import { Account } from 'src/auth/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tech, Account])],
  controllers: [TechController],
  providers: [TechService],
})
export class TechModule {}
