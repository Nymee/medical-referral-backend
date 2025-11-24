import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';

@Module({
  providers: [OutcomesService],
  controllers: [OutcomesController]
})
export class OutcomesModule {}
