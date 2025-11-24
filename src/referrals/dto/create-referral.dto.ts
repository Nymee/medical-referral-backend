import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';
import { CONDITIONS } from 'src/common/constants/conditions';
import type { ConditionCode } from 'src/common/constants/conditions';

export class CreateReferralDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  toDoctorId: string; // Which specialist to refer to

  @IsString()
  @IsIn(Object.keys(CONDITIONS)) // Must be one of our condition codes
  conditionCode: ConditionCode;

  @IsString()
  @IsOptional()
  subCondition?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @Min(0)
  patientAge: number; // For ML features
}
