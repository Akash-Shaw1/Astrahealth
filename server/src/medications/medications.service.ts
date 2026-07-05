import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private prisma: PrismaService) {}

  // Helper to parse DB medication fields
  parseMedication(m: any) {
    if (!m) return null;
    return {
      ...m,
      reminderTimes: JSON.parse(m.reminderTimes || '[]'),
      precautions: JSON.parse(m.precautions || '[]'),
      sideEffects: JSON.parse(m.sideEffects || '[]'),
    };
  }

  async findAll(userId: string, query: { familyMemberId?: string }) {
    // We fetch medications where familyMember belongs to the current user
    const whereClause: any = {
      familyMember: {
        userId,
      },
      isActive: true,
    };

    if (query.familyMemberId) {
      whereClause.familyMemberId = query.familyMemberId;
    }

    const list = await this.prisma.medication.findMany({
      where: whereClause,
      include: {
        familyMember: { select: { name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return list.map(this.parseMedication.bind(this));
  }

  async findOne(userId: string, id: string) {
    const medication = await this.prisma.medication.findFirst({
      where: {
        id,
        familyMember: { userId },
      },
      include: {
        familyMember: true,
      },
    });
    if (!medication) throw new NotFoundException('Medication not found');
    return this.parseMedication(medication);
  }

  async create(userId: string, data: any) {
    // Verify family member belongs to user
    const member = await this.prisma.familyMember.findFirst({
      where: { id: data.familyMemberId, userId },
    });
    if (!member) throw new NotFoundException('Family member not found');

    const created = await this.prisma.medication.create({
      data: {
        familyMemberId: data.familyMemberId,
        name: data.name,
        genericName: data.genericName || null,
        brand: data.brand || null,
        strength: data.strength || null,
        form: data.form || null,
        purpose: data.purpose || null,
        dosageInstructions: data.dosageInstructions || null,
        frequency: data.frequency || null,
        timing: data.timing || null,
        mealTiming: data.mealTiming || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        remainingDoses: data.remainingDoses || 30,
        totalDoses: data.totalDoses || 30,
        reminderEnabled: data.reminderEnabled || false,
        reminderTimes: JSON.stringify(data.reminderTimes || []),
        precautions: JSON.stringify(data.precautions || []),
        sideEffects: JSON.stringify(data.sideEffects || []),
        addedBy: data.addedBy || 'manual_entry',
        isActive: true,
      },
    });

    return this.parseMedication(created);
  }

  async update(userId: string, id: string, data: any) {
    const medication = await this.prisma.medication.findFirst({
      where: { id, familyMember: { userId } },
    });
    if (!medication) throw new NotFoundException('Medication not found');

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.reminderTimes) updateData.reminderTimes = JSON.stringify(data.reminderTimes);
    if (data.precautions) updateData.precautions = JSON.stringify(data.precautions);
    if (data.sideEffects) updateData.sideEffects = JSON.stringify(data.sideEffects);

    const updated = await this.prisma.medication.update({
      where: { id },
      data: updateData,
    });

    return this.parseMedication(updated);
  }

  async remove(userId: string, id: string) {
    const medication = await this.prisma.medication.findFirst({
      where: { id, familyMember: { userId } },
    });
    if (!medication) throw new NotFoundException('Medication not found');

    await this.prisma.medication.delete({ where: { id } });
    return { success: true };
  }

  async complete(userId: string, id: string) {
    const medication = await this.prisma.medication.findFirst({
      where: { id, familyMember: { userId } },
    });
    if (!medication) throw new NotFoundException('Medication not found');

    const updated = await this.prisma.medication.update({
      where: { id },
      data: {
        isActive: false,
        remainingDoses: 0,
      },
    });

    return this.parseMedication(updated);
  }

  async refill(userId: string, id: string, additionalDoses: number) {
    const medication = await this.prisma.medication.findFirst({
      where: { id, familyMember: { userId } },
    });
    if (!medication) throw new NotFoundException('Medication not found');

    const updated = await this.prisma.medication.update({
      where: { id },
      data: {
        remainingDoses: medication.remainingDoses + additionalDoses,
        totalDoses: medication.totalDoses + additionalDoses,
        isActive: true,
      },
    });

    return this.parseMedication(updated);
  }

  async takeDose(userId: string, id: string, amount = 1) {
    const medication = await this.prisma.medication.findFirst({
      where: { id, familyMember: { userId } },
    });
    if (!medication) throw new NotFoundException('Medication not found');

    const newRemaining = Math.max(0, medication.remainingDoses - amount);
    const updates: any = {
      remainingDoses: newRemaining,
    };

    if (newRemaining === 0) {
      updates.isActive = false; // auto complete course
    }

    const updated = await this.prisma.medication.update({
      where: { id },
      data: updates,
    });

    return this.parseMedication(updated);
  }
}
