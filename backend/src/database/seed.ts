import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@collospot.com' },
    update: {},
    create: {
      email: 'admin@collospot.com',
      phone: '+254700000000',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create default plans
  const plans = [
    {
      name: 'Basic 1 Hour',
      description: 'Perfect for quick browsing and social media',
      price: 20,
      duration: 1,
      dataLimit: '500MB',
      speedLimit: '5Mbps'
    },
    {
      name: 'Standard 6 Hours',
      description: 'Great for work and entertainment',
      price: 100,
      duration: 6,
      dataLimit: '2GB',
      speedLimit: '10Mbps'
    },
    {
      name: 'Premium 24 Hours',
      description: 'Full day unlimited access',
      price: 300,
      duration: 24,
      dataLimit: '10GB',
      speedLimit: '20Mbps'
    },
    {
      name: 'Weekly Package',
      description: 'Perfect for extended stays',
      price: 1500,
      duration: 168, // 7 days
      dataLimit: '50GB',
      speedLimit: '25Mbps'
    },
    {
      name: 'Monthly Unlimited',
      description: 'Ultimate internet freedom',
      price: 5000,
      duration: 720, // 30 days
      dataLimit: 'Unlimited',
      speedLimit: '50Mbps'
    }
  ];

  // Delete existing plans and create new ones
  await prisma.plan.deleteMany({});
  
  const createdPlans = await prisma.plan.createMany({
    data: plans
  });
  
  console.log(`✅ Created ${createdPlans.count} plans`);
  
  const allPlans = await prisma.plan.findMany();
  allPlans.forEach(plan => {
    console.log('✅ Plan created:', plan.name);
  });

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });