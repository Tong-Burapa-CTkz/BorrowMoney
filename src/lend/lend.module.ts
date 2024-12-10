import { Module } from '@nestjs/common';
import { LendService } from './lend.service';
import { LendController } from './lend.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [LendController],
  providers: [LendService, AuthService],
  imports: [PrismaModule],
  exports: [LendService, AuthService], 
})
export class LendModule {}
