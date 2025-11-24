import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('referrals')
@UseGuards(AuthGuard)  // Protect all routes in this controller
export class ReferralsController {
  constructor(private service: ReferralsService) {}

  @Post('create')
  async createReferral(
    @Body() createReferralDto: CreateReferralDto,
    @Req() req: Request,
  ) {
    const fromDoctorId = req.user!.sub;  // Extract doctor ID from JWT
    return this.service.createReferral(createReferralDto, fromDoctorId);
  }
}
