import { Controller, Post } from '@nestjs/common';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { OutcomesService } from './outcomes.service';

@Controller('outcomes')
export class OutcomesController {
  constructor(private outcomeService: OutcomesService) {}

  @Post()
  createOutcome(createOutcomeDto: CreateOutcomeDto) {
    return this.outcomeService.createOutcome(createOutcomeDto);
  }
}
