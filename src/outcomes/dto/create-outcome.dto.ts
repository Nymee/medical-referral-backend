import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ResolutionType } from '../../common/enums';

export class CreateOutcomeDto {
  @IsString()
  @IsNotEmpty()
  referralId: string;

  @IsEnum(ResolutionType)
  resolutionType: ResolutionType;

  @IsString()
  @IsOptional()
  notes?: string;
}
