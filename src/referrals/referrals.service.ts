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
    // 1. Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createReferralDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // 2. Verify specialist exists
    const toDoctor = await this.prisma.doctor.findUnique({
      where: { id: createReferralDto.toDoctorId },
    });

    if (!toDoctor) {
      throw new NotFoundException('Specialist not found');
    }

    // 3. Get the doctor creating this referral
    const fromDoctor = await this.prisma.doctor.findUnique({
      where: { id: fromDoctorId },
    });

    // 4. Determine if this is a root or child referral
    let referralDepth = 1;
    let rootReferralId = null;

    if (fromDoctor.role === 'SPECIALIST') {
      if (referralOutcome === ResolutionType.REFERRED_FURTHER) {
        // This is a specialist referring to another specialist
        // Find the referral that brought this patient to me
        const previousReferral = await this.prisma.referral.findFirst({
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
            previousReferral.rootReferralId || previousReferral.id;
        }
      } else if (referralOutcome === ResolutionType.RESOLVED_REFERRED) {
      }
    }

    // 5. Create the referral
    const referral = await this.prisma.referral.create({
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
}
