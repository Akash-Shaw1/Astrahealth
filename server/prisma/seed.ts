import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  await prisma.feedback.deleteMany({});
  await prisma.campaignRegistration.deleteMany({});
  await prisma.healthCampaign.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.medicalRecord.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.vitalsEntry.deleteMany({});
  await prisma.familyMember.deleteMany({});
  await prisma.chatSession.deleteMany({});
  await prisma.healthGoal.deleteMany({});
  await prisma.educationProgress.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.doctor.deleteMany({});

  console.log('🧹 Cleaned existing database tables.');

  // 2. Create Seed User (for linking reviews and general mock relations)
  const seedUser = await prisma.user.create({
    data: {
      id: '00000000-0000-0000-0000-000000000001',
      clerkUserId: 'user_seed_clerk_id',
      email: 'demo-patient@astrahealth.com',
      firstName: 'Arindam',
      lastName: 'Chatterjee',
      avatarUrl: '/patient-arindam.png',
      phone: '+91 98301 23456',
      dateOfBirth: new Date('1973-04-12'),
      gender: 'Male',
      address: 'Flat 3B, Lake Gardens, Kolkata, WB 700045',
      bloodGroup: 'B+',
      emergencyContactName: 'Madhumita Chatterjee',
      emergencyContactPhone: '+91 98740 56789',
      emergencyContactRelationship: 'Spouse',
      preferredLanguage: 'en',
      preferredHospital: 'Apollo Hospital',
      insuranceProvider: 'Star Health Insurance',
      insurancePolicyNumber: 'SH-983021-99',
      knownConditions: JSON.stringify(['Hypertension']),
      allergies: JSON.stringify(['None']),
      onboardingComplete: true,
    },
  });
  console.log('👤 Created default seed patient user.');

  // Create "Self" Family Member
  await prisma.familyMember.create({
    data: {
      id: '00000000-0000-0000-0000-000000000002',
      userId: seedUser.id,
      name: 'Arindam Chatterjee',
      relationship: 'Self',
      dateOfBirth: new Date('1973-04-12'),
      gender: 'Male',
      avatar: '/patient-arindam.png',
      phone: '+91 98301 23456',
      email: 'demo-patient@astrahealth.com',
      address: 'Flat 3B, Lake Gardens, Kolkata, WB 700045',
      knownConditions: JSON.stringify(['Hypertension']),
      allergies: JSON.stringify(['None']),
      bloodGroup: 'B+',
    },
  });

  // Create Spouse Family Member
  await prisma.familyMember.create({
    data: {
      id: '00000000-0000-0000-0000-000000000003',
      userId: seedUser.id,
      name: 'Madhumita Chatterjee',
      relationship: 'Spouse',
      dateOfBirth: new Date('1975-11-03'),
      gender: 'Female',
      avatar: '/patient-madhumita.png',
      phone: '+91 98740 56789',
      knownConditions: JSON.stringify(['Hypothyroidism', 'Mild Anxiety']),
      allergies: JSON.stringify(['None']),
      bloodGroup: 'O+',
    },
  });

  // Create Child Family Member
  await prisma.familyMember.create({
    data: {
      id: '00000000-0000-0000-0000-000000000004',
      userId: seedUser.id,
      name: 'Riya Chatterjee',
      relationship: 'Child',
      dateOfBirth: new Date('2011-06-18'),
      gender: 'Female',
      avatar: '/patient-riya.png',
      phone: '+91 98360 11122',
      knownConditions: JSON.stringify(['Seasonal Allergies']),
      allergies: JSON.stringify(['Dust mites', 'Pollen']),
      bloodGroup: 'B+',
    },
  });
  console.log('👥 Created family member profiles (Self, Spouse, Child).');

  // 3. Seed Doctors
  const doctorsPath = path.join(__dirname, '../../client/lib/data/doctors.json');
  if (fs.existsSync(doctorsPath)) {
    const rawDoctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf8'));
    for (const doc of rawDoctors) {
      await prisma.doctor.create({
        data: {
          id: doc.id.includes('-') ? doc.id.replace('doc-', '00000000-0000-0000-0000-000000000') : undefined, // clean uuid mapping
          name: doc.name,
          specialty: doc.specialty,
          avatar: doc.avatar === '/' ? '/placeholder.svg' : doc.avatar,
          rating: doc.rating,
          experience: doc.experience,
          education: doc.education,
          languages: JSON.stringify(doc.languages),
          availability: JSON.stringify(doc.availability),
          consultationFee: doc.consultationFee,
          bio: doc.bio,
          hospitalAffiliation: doc.hospitalAffiliation || 'Kolkata Multispecialty Center',
        },
      });
    }
    console.log(`👨‍⚕️ Seeded ${rawDoctors.length} doctors.`);
  } else {
    console.log('⚠️ Doctors seed data file not found at:', doctorsPath);
  }

  // 4. Seed Health Campaigns
  const campaignsPath = path.join(__dirname, '../../client/data/health-campaigns.json');
  if (fs.existsSync(campaignsPath)) {
    const rawCampaignsData = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
    const campaigns = rawCampaignsData.campaigns || rawCampaignsData;
    for (const camp of campaigns) {
      await prisma.healthCampaign.create({
        data: {
          title: camp.title,
          type: camp.type,
          description: camp.description,
          organiser: camp.organiser,
          location: camp.location,
          startDate: new Date(camp.startDate),
          endDate: new Date(camp.endDate),
          capacity: camp.capacity,
          registrationRequired: camp.registrationRequired,
          vaccines: JSON.stringify(camp.vaccines || []),
          contactPhone: camp.contactInfo?.phone || null,
          contactEmail: camp.contactInfo?.email || null,
        },
      });
    }
    console.log(`📢 Seeded ${campaigns.length} health campaigns.`);
  } else {
    console.log('⚠️ Campaigns seed data file not found at:', campaignsPath);
  }

  // 5. Seed Feedback & Reviews
  const feedbackFiles = [
    { type: 'hospital', file: 'hospitals.json', nameKey: 'name' },
    { type: 'doctor', file: 'doctors.json', nameKey: 'name' },
    { type: 'medicine_shop', file: 'medicine-shops.json', nameKey: 'shop_name' },
    { type: 'testing_center', file: 'testing-centers.json', nameKey: 'center_name' },
    { type: 'ambulance_service', file: 'ambulance-services.json', nameKey: 'service_name' },
  ];

  let feedbackCount = 0;
  for (const fItem of feedbackFiles) {
    const fPath = path.join(__dirname, `../../client/data/feedback/${fItem.file}`);
    if (fs.existsSync(fPath)) {
      const list = JSON.parse(fs.readFileSync(fPath, 'utf8'));
      for (const item of list) {
        await prisma.feedback.create({
          data: {
            userId: seedUser.id,
            entityType: fItem.type,
            entityId: item.id || 'unknown',
            entityName: item[fItem.nameKey] || 'General Entity',
            ratings: JSON.stringify(item.ratings || { overall: 4 }),
            reviewText: item.review_text || '',
            isReferral: item.referral_count > 0,
            referralTo: item.referral_count > 0 ? 'General' : null,
            isEscalation: item.escalation || false,
            escalationReason: item.escalation ? 'General Escalation' : null,
            createdAt: item.timestamp ? new Date(item.timestamp) : new Date(),
          },
        });
        feedbackCount++;
      }
    }
  }
  console.log(`💬 Seeded ${feedbackCount} feedback records.`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
