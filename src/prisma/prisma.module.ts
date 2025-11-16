import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes it available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export so AuthModule can use it
})
export class PrismaModule {}