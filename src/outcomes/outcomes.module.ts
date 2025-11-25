import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import { ReferralsModule } from 'src/referrals/referrals.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [OutcomesService],
  controllers: [OutcomesController],
  imports: [ReferralsModule, AuthModule],
})
export class OutcomesModule {}
