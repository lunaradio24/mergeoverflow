import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from './util.service';

@Module({
  imports: [JwtModule],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
