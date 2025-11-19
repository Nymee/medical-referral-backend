import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Inject JWT service
  ) {}

  async signup(signupDto: SignupDto) {
    // 1. Check if user exists
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { email: signupDto.email },
    });

    if (existingDoctor) {
      throw new ConflictException('Email already registered');
    }

    if (signupDto.role === 'SPECIALIST' && !signupDto.specialty) {
      throw new BadRequestException('Specialists must provide a specialty');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // 3. Create doctor
    const doctor = await this.prisma.doctor.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
        specialty: signupDto.specialty,
        role: signupDto.role,
      },
    });

    // 4. Generate JWT
    const payload = { sub: doctor.id, email: doctor.email, role: doctor.role };
    const token = this.jwtService.sign(payload);

    // 5. Return token + user info (without password)
    const { password, ...result } = doctor;
    return {
      access_token: token,
      user: result,
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Find user by email
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: loginDto.email },
    });

    if (!doctor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      doctor.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT
    const payload = { id: doctor.id, email: doctor.email, role: doctor.role };
    const token = this.jwtService.sign(payload);

    // 4. Return token + user (without password)
    const { password, ...result } = doctor;
    return {
      access_token: token,
      user: result,
    };
  }
}
