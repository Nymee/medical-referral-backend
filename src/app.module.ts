import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ReferralsModule } from './referrals/referrals.module';

@Module({
  imports: [AuthModule, PrismaModule,ConfigModule.forRoot({ isGlobal: true }), ReferralsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
