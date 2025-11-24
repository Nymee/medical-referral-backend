import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import { ReferralsModule } from 'src/referrals/referrals.module';

@Module({
  providers: [OutcomesService],
  controllers: [OutcomesController],
  imports: [ReferralsModule]
})
export class OutcomesModule {}
