import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { OutcomesService } from './outcomes.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { Request } from 'express';

@Controller('outcomes')
@UseGuards(AuthGuard)
export class OutcomesController {
  constructor(private outcomeService: OutcomesService) {}

  @Post('referral/:referral_id/outcome')
  async createOutcome(
    @Body() createOutcomeDto: CreateOutcomeDto,
    @Req() req: Request,
  ) {
    const fromDoctorId = req.user!.sub;
    return this.outcomeService.createOutcome(createOutcomeDto, fromDoctorId);
  }
}
