import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReferralDto } from './dto/create-referral.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DbClient, ResolutionType } from 'src/common';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async createReferral(
    createReferralDto: CreateReferralDto,
    fromDoctorId: string,
    db?: DbClient,
    referralOutcome?: ResolutionType,
  ) {
    const dbClient = db || this.prisma;

    // 1. Verify patient exists
    const patient = await dbClient.patient.findUnique({
      where: { id: createReferralDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // 2. Verify specialist exists
    const toDoctor = await dbClient.doctor.findUnique({
      where: { id: createReferralDto.toDoctorId },
    });

    if (!toDoctor) {
      throw new NotFoundException('Specialist not found');
    }

    // 3. Get the doctor creating this referral
    const fromDoctor = await dbClient.doctor.findUnique({
      where: { id: fromDoctorId },
    });

    this.checkForBoomerang(createReferralDto, dbClient);

    // 4. Determine if this is a root or child referral
    let referralDepth = 1;
    let rootReferralId: string | null = null;

    if (fromDoctor?.role === 'SPECIALIST') {
      if (referralOutcome === ResolutionType.REFERRED_FURTHER) {
        // This is a specialist referring to another specialist
        // Find the referral that brought this patient to me
        const previousReferral = await dbClient.referral.findFirst({
          where: {
            toDoctorId: fromDoctorId, // Sent to ME
            patientId: createReferralDto.patientId, // For THIS patient
            conditionCode: createReferralDto.conditionCode, // Same condition
          },
          orderBy: { createdAt: 'desc' }, // Most recent
        });

        if (previousReferral) {
          // This is a child referral
          referralDepth = previousReferral.referralDepth + 1;

          // Find the root of the chain
          rootReferralId =
            previousReferral.rootReferralId || previousReferral.id || null;
        }
      } else if (referralOutcome === ResolutionType.RESOLVED_REFERRED) {
      }
    }

    // 5. Create the referral
    const referral = await dbClient.referral.create({
      data: {
        fromDoctorId,
        toDoctorId: createReferralDto.toDoctorId,
        patientId: createReferralDto.patientId,
        conditionCode: createReferralDto.conditionCode,
        subCondition: createReferralDto.subCondition,
        notes: createReferralDto.notes,
        patientAge: createReferralDto.patientAge,
        referralDepth,
        rootReferralId,
        status: 'PENDING',
      },
      include: {
        fromDoctor: {
          select: { id: true, name: true, specialty: true, role: true },
        },
        toDoctor: {
          select: { id: true, name: true, specialty: true, role: true },
        },
        patient: {
          select: { id: true, name: true, age: true },
        },
      },
    });

    return referral;
  }

  async checkForBoomerang(referralDto: CreateReferralDto, db: DbClient) {
    const DAYS = 90;
    const cutoffDate = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

    // 1. Get latest resolved referral
    const latestResolved = await db.referral.findFirst({
      where: {
        patientId: referralDto.patientId,
        conditionCode: referralDto.conditionCode,
        subCondition: referralDto.subCondition,
        outcome: {
          is: {
            resolutionType: {
              in: [
                ResolutionType.FULLY_RESOLVED,
                ResolutionType.RESOLVED_REFERRED,
              ],
            },
          },
        },
      },
      include: { outcome: true },
      orderBy: { outcome: { createdAt: 'desc' } },
    });

    // No past resolved referral → no boomerang
    if (!latestResolved) return;

    // No outcome (should not happen) → skip
    if (!latestResolved.outcome) return;

    // 2. If this specific referral already boomeranged recently → don't penalize again
    if (
      latestResolved.isBoomerang &&
      latestResolved.outcome.createdAt >= cutoffDate
    ) {
      return;
    }

    // 3. Count past boomerangs of THIS doctor for THIS issue
    const pastBoomerangCount = await db.referral.count({
      where: {
        toDoctorId: latestResolved.toDoctorId,
        patientId: referralDto.patientId,
        conditionCode: referralDto.conditionCode,
        subCondition: referralDto.subCondition,
        isBoomerang: true,
        outcome: {
          is: {
            createdAt: { gte: cutoffDate },
          },
        },
      },
    });

    // 4. Determine penalty based on recurrence
    const deduction = this.penalty(pastBoomerangCount);

    // 5. Apply penalty to doctor
    await db.doctor.update({
      where: { id: latestResolved.toDoctorId },
      data: {
        score: { decrement: deduction },
      },
    });

    // 6. Mark this referral as boomerang
    await db.referral.update({
      where: { id: latestResolved.id },
      data: { isBoomerang: true },
    });
  }

  penalty(n: number) {
    if (n === 0) return 10; // 1st boomerang
    if (n === 1) return 15; // 2nd boomerang
    if (n === 2) return 20; // 3rd boomerang
    return 25; // 4th+
  }
}
