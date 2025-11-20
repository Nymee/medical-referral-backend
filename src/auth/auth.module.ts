import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        //registerAsync lets you inject ConfigService at module initialization time, so JwtService gets the secret before it starts signing tokens. Without this, JwtService wouldn't know what secret to use
        secret: configService.get('JWT_SECRET'), // even if you did this import at app module level it'd be the same but for better separation of concerns we are writing this here.
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}

//jwt module is only available in auth module because of imports
