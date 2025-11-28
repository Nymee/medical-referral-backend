import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { ResolutionType } from '../../common/enums';
import { Type } from 'class-transformer';
import { CreateReferralDto } from 'src/referrals/dto/create-referral.dto';

export class CreateOutcomeDto {
  @IsString()
  @IsNotEmpty()
  referralId: string;

  @IsEnum(ResolutionType)
  resolutionType: ResolutionType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsNotEmpty()
  firstVisitDate: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateReferralDto)
  nextReferral?: CreateReferralDto;
}
