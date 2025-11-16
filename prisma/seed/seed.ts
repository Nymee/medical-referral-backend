import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Check if admin exists
  const existingAdmin = await prisma.doctor.findFirst({
    where: { role: 'ADMIN' }
  });

  if (existingAdmin) {
    console.log('✅ Admin already exists, skipping seed');
    return;
  }

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.doctor.create({
    data: {
      email: 'admin@hospital.com',
      password: hashedPassword,
      name: 'System Administrator',
      specialty: 'Administration',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin created:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });