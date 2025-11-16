import { IsEmail, IsNotEmpty, IsString, IsIn, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsIn(['PCP', 'SPECIALIST'])
  role: 'PCP' | 'SPECIALIST';
}