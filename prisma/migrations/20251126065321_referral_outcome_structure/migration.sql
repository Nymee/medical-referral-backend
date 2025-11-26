-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'PATIENT_VISITED', 'COMPLETED', 'REFERRED_AGAIN');

-- CreateEnum
CREATE TYPE "ResolutionType" AS ENUM ('FULLY_RESOLVED', 'REFERRED_FURTHER', 'RESOLVED_REFERRED', 'UNRESOLVED');

-- CreateEnum
CREATE TYPE "ConditionCode" AS ENUM ('KNEE_PAIN', 'CHEST_PAIN', 'BACK_PAIN', 'HEADACHE', 'DIABETES_MGMT');

-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "specialty" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "fromDoctorId" TEXT NOT NULL,
    "toDoctorId" TEXT NOT NULL,
    "conditionCode" TEXT NOT NULL,
    "subCondition" TEXT,
    "notes" TEXT,
    "patientAge" INTEGER,
    "referralDepth" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rootReferralId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "resolutionType" "ResolutionType" NOT NULL,
    "notes" TEXT,
    "daysToResolution" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rootReferralId" TEXT NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Outcome_referralId_key" ON "Outcome"("referralId");

-- CreateIndex
CREATE INDEX "Outcome_rootReferralId_idx" ON "Outcome"("rootReferralId");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_rootReferralId_fkey" FOREIGN KEY ("rootReferralId") REFERENCES "Referral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_fromDoctorId_fkey" FOREIGN KEY ("fromDoctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_toDoctorId_fkey" FOREIGN KEY ("toDoctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
