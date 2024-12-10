import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { LendModule } from './lend/lend.module';
import { PrismaService } from 'prisma/prisma.service';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [LendModule,UserModule,AuthModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
