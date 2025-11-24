import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { DbClient } from 'src/common';

@Injectable()
export class OutcomesService {
  constructor(private prisma: PrismaService) {}

  async createOutcome(createOutcomeDto: CreateOutcomeDto, doctorId: string, db: DbClient = this.prisma) {
    this.logger.log(
      `Creating outcome for referral ${createOutcomeDto.referralId}`,
    ) ;

    // Get referral
    const referral = await this.prisma.referral.findUnique({
      where: { id: createOutcomeDto.referralId },
      include: { outcome: true },
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    // Verify this doctor received the referral
    if (referral.toDoctorId !== doctorId) {
      throw new BadRequestException(
        'You can only log outcomes for referrals sent to you',
      );
    }

    // Check if outcome already exists
    if (referral.outcome) {
      throw new BadRequestException('Outcome already exists for this referral');
    }

    // Verify patient visited
    if (!referral.firstVisitDate) {
      throw new BadRequestException(
        'Please mark patient as visited before logging outcome',
      );
    }

    // Calculate days to resolution
    const daysToResolution = Math.floor(
      (new Date().getTime() - referral.firstVisitDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    FULLY_RESOLVED
  REFERRED_FURTHER
  RESOLVED_REFERRED  // NEW
  UNRESOLVED

    if(createOutcomeDto.resolutionType == "REFERRED_FURTHER" ){

      //continue chain.


    }else if(createOutcomeDto.resolutionType == "RESOLVED_REFERRED"){

      //logic to create new referral and end this current chain.



    }

    // Create outcome
    const outcome = await this.prisma.outcome.create({
      data: {
        referralId: createOutcomeDto.referralId,
        resolutionType: createOutcomeDto.resolutionType,
        daysToResolution,
        notes: createOutcomeDto.notes,
        rootReferralId: referral.rootReferralId || referral.id, // Store root for easy querying
      },
    });
  }
}
