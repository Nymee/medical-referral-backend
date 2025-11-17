import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';

@Controller('referrals')
export class ReferralsController {
  constructor(private service: ReferralsService) {}

  @Post('create')
  async signup(@Body() createReferralDto: CreateReferralDto) {
    return this.service.createReferral(createReferralDto);
  }
}
