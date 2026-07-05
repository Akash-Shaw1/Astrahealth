import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Helper to parse DB user fields for standard JSON outputs
  parseUserFields(user: any) {
    if (!user) return null;
    return {
      ...user,
      knownConditions: JSON.parse(user.knownConditions || '[]'),
      allergies: JSON.parse(user.allergies || '[]'),
      notificationPrefs: JSON.parse(user.notificationPrefs || '{}'),
      onboardingDraft: user.onboardingDraft ? JSON.parse(user.onboardingDraft) : null,
    };
  }

  async getMe(clerkUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return this.parseUserFields(user);
  }

  async updateMe(clerkUserId: string, updateData: any) {
    const user = await this.prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new NotFoundException('User not found');

    const data: any = { ...updateData };

    // Stringify array/JSON fields for SQLite compat
    if (updateData.knownConditions) {
      data.knownConditions = JSON.stringify(updateData.knownConditions);
    }
    if (updateData.allergies) {
      data.allergies = JSON.stringify(updateData.allergies);
    }
    if (updateData.notificationPrefs) {
      data.notificationPrefs = JSON.stringify(updateData.notificationPrefs);
    }

    const updated = await this.prisma.user.update({
      where: { clerkUserId },
      data,
    });

    return this.parseUserFields(updated);
  }

  async saveOnboardingDraft(clerkUserId: string, draft: any) {
    const user = await this.prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { clerkUserId },
      data: {
        onboardingDraft: JSON.stringify(draft),
      },
    });

    return this.parseUserFields(updated);
  }

  async completeOnboarding(clerkUserId: string, onboardingData: any) {
    const user = await this.prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new NotFoundException('User not found');

    const {
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      preferredLanguage,
      preferredHospital,
      insuranceProvider,
      insurancePolicyNumber,
      knownConditions,
      allergies,
      notificationPrefs,
      familyMembers, // optional dependents added during onboarding
      medications,   // optional medications added during onboarding
    } = onboardingData;

    // 1. Update primary User details
    const updatedUser = await this.prisma.user.update({
      where: { clerkUserId },
      data: {
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || 'Unspecified',
        address,
        bloodGroup,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        preferredLanguage: preferredLanguage || 'en',
        preferredHospital,
        insuranceProvider,
        insurancePolicyNumber,
        knownConditions: JSON.stringify(knownConditions || []),
        allergies: JSON.stringify(allergies || []),
        notificationPrefs: JSON.stringify(notificationPrefs || {
          appointments: true,
          medications: true,
          updates: false,
          marketing: false,
        }),
        onboardingComplete: true,
        onboardingDraft: null, // clear draft
      },
    });

    // 2. Update or create the "Self" family member profile to match onboarding details
    const selfMember = await this.prisma.familyMember.findFirst({
      where: { userId: user.id, relationship: 'Self' },
    });

    const selfName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Self';

    if (selfMember) {
      await this.prisma.familyMember.update({
        where: { id: selfMember.id },
        data: {
          name: selfName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || 'Unspecified',
          phone,
          address,
          bloodGroup,
          knownConditions: JSON.stringify(knownConditions || []),
          allergies: JSON.stringify(allergies || []),
        },
      });
    } else {
      await this.prisma.familyMember.create({
        data: {
          userId: user.id,
          name: selfName,
          relationship: 'Self',
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || 'Unspecified',
          phone,
          address,
          bloodGroup,
          knownConditions: JSON.stringify(knownConditions || []),
          allergies: JSON.stringify(allergies || []),
        },
      });
    }

    // 3. Create any additional family members added in the onboarding wizard
    if (familyMembers && Array.isArray(familyMembers)) {
      for (const m of familyMembers) {
        await this.prisma.familyMember.create({
          data: {
            userId: user.id,
            name: m.name,
            relationship: m.relationship,
            dateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth) : null,
            gender: m.gender || 'Unspecified',
            phone: m.phone,
            email: m.email,
            address: m.address || address,
            knownConditions: JSON.stringify(m.knownConditions || []),
            allergies: JSON.stringify(m.allergies || []),
            bloodGroup: m.bloodGroup,
          },
        });
      }
    }

    // 4. Create any medications added in onboarding (link to the "Self" member)
    const activeSelfMember = await this.prisma.familyMember.findFirst({
      where: { userId: user.id, relationship: 'Self' },
    });

    if (activeSelfMember && medications && Array.isArray(medications)) {
      for (const med of medications) {
        await this.prisma.medication.create({
          data: {
            familyMemberId: activeSelfMember.id,
            name: med.name,
            genericName: med.genericName,
            brand: med.brand,
            strength: med.strength,
            form: med.form,
            purpose: med.purpose,
            dosageInstructions: med.dosageInstructions,
            frequency: med.frequency,
            timing: med.timing,
            mealTiming: med.mealTiming,
            startDate: med.startDate ? new Date(med.startDate) : new Date(),
            endDate: med.endDate ? new Date(med.endDate) : null,
            remainingDoses: med.remainingDoses || 30,
            totalDoses: med.totalDoses || 30,
            reminderEnabled: med.reminderEnabled || false,
            reminderTimes: JSON.stringify(med.reminderTimes || []),
            precautions: JSON.stringify(med.precautions || []),
            sideEffects: JSON.stringify(med.sideEffects || []),
            addedBy: 'manual_entry',
          },
        });
      }
    }

    return this.parseUserFields(updatedUser);
  }
}
