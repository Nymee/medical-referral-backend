import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { DbClient, ResolutionType } from 'src/common';
import { ReferralsService } from 'src/referrals/referrals.service';
import { CreateReferralDto } from 'src/referrals/dto/create-referral.dto';

@Injectable()
export class OutcomesService {
  private readonly logger = new Logger(OutcomesService.name);

  constructor(
    private prisma: PrismaService,
    private referralService: ReferralsService,
  ) {}

  async createOutcome(dto: CreateOutcomeDto, doctorId: string) {
    const requiresTransaction =
      dto.resolutionType === ResolutionType.REFERRED_FURTHER ||
      dto.resolutionType === ResolutionType.RESOLVED_REFERRED;

    if (requiresTransaction) {
      this.logger.log(
        `Outcome type requires referral creation — using transaction`,
      );
      return this.prisma.$transaction((tx) =>
        this._createOutcomeInternal(dto, doctorId, tx),
      );
    }
    this.logger.log(`Simple outcome — no referral, no transaction needed`);
    return this._createOutcomeInternal(dto, doctorId, this.prisma);
  }

  private async _createOutcomeInternal(
    dto: CreateOutcomeDto,
    fromDoctorId: string,
    db: DbClient,
  ) {
    const referral = await db.referral.findUnique({
      where: { id: dto.referralId },
      include: { outcome: true },
    });

    if (!referral) throw new NotFoundException('Referral not found');

    // 2. Ensure doctor owns this referral
    if (referral.toDoctorId !== fromDoctorId)
      throw new BadRequestException(
        'You can only log outcomes for referrals sent to you',
      );

    // 3. Ensure not already resolved
    if (referral.outcome)
      throw new BadRequestException('Outcome already exists for this referral');

    // 5. Compute days to resolution
    const daysToResolution = Math.floor(
      (Date.now() - dto.firstVisitDate) / (1000 * 60 * 60 * 24),
    );

    // 6. Create outcome
    const outcome = await db.outcome.create({
      data: {
        referralId: dto.referralId,
        resolutionType: dto.resolutionType,
        daysToResolution,
        notes: dto.notes,
        rootReferralId: referral.rootReferralId || referral.id,
        createdAt: new Date(),
        firstVisitDate: BigInt(dto.firstVisitDate),
      },
    });

    this.logger.log(`Outcome created: ${outcome.id}`);

    // 7. Handle referral continuation
    if (
      dto.resolutionType === ResolutionType.REFERRED_FURTHER ||
      dto.resolutionType === ResolutionType.RESOLVED_REFERRED
    ) {
      this.logger.log(`Handling REFERRED_FURTHER chain continuation`);

      if (dto.nextReferral) {
        await this.referralService.createReferral(
          dto.nextReferral,
          fromDoctorId,
          db,
          ResolutionType.REFERRED_FURTHER,
        );
      }
    }

    if (
      dto.resolutionType === ResolutionType.REFERRED_FURTHER ||
      dto.resolutionType === ResolutionType.RESOLVED_REFERRED
    ) {
    }
  }
}
