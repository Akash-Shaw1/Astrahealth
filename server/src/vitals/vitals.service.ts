import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VitalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: { familyMemberId?: string; days?: number }) {
    const whereClause: any = { userId };
    if (query.familyMemberId) {
      whereClause.familyMemberId = query.familyMemberId;
    }

    if (query.days) {
      const cutOffDate = new Date();
      cutOffDate.setDate(cutOffDate.getDate() - query.days);
      whereClause.measuredAt = { gte: cutOffDate };
    }

    return this.prisma.vitalsEntry.findMany({
      where: whereClause,
      include: {
        familyMember: { select: { name: true } },
      },
      orderBy: { measuredAt: 'desc' },
    });
  }

  async create(userId: string, data: any) {
    // Validate family member belongs to user
    const member = await this.prisma.familyMember.findFirst({
      where: { id: data.familyMemberId, userId },
    });
    if (!member) throw new NotFoundException('Family member not found');

    return this.prisma.vitalsEntry.create({
      data: {
        userId,
        familyMemberId: data.familyMemberId,
        heartRate: data.heartRate ? Number(data.heartRate) : null,
        systolic: data.systolic ? Number(data.systolic) : null,
        diastolic: data.diastolic ? Number(data.diastolic) : null,
        temperature: data.temperature ? Number(data.temperature) : null,
        weight: data.weight ? Number(data.weight) : null,
        spO2: data.spO2 ? Number(data.spO2) : null,
        bloodSugar: data.bloodSugar ? Number(data.bloodSugar) : null,
        notes: data.notes || null,
        measuredAt: data.measuredAt ? new Date(data.measuredAt) : new Date(),
      },
    });
  }

  async remove(userId: string, id: string) {
    const entry = await this.prisma.vitalsEntry.findFirst({
      where: { id, userId },
    });
    if (!entry) throw new NotFoundException('Vitals log entry not found');

    await this.prisma.vitalsEntry.delete({ where: { id } });
    return { success: true };
  }

  async getTrends(userId: string, familyMemberId: string, days = 30) {
    // Return sorted vital history formatted for charting
    const entries = await this.prisma.vitalsEntry.findMany({
      where: {
        userId,
        familyMemberId,
      },
      orderBy: { measuredAt: 'asc' },
      take: days,
    });

    return entries.map((entry) => ({
      id: entry.id,
      date: entry.measuredAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      heartRate: entry.heartRate,
      systolic: entry.systolic,
      diastolic: entry.diastolic,
      bloodPressure: entry.systolic && entry.diastolic ? `${entry.systolic}/${entry.diastolic}` : null,
      temperature: entry.temperature,
      weight: entry.weight,
      spO2: entry.spO2,
      bloodSugar: entry.bloodSugar,
      measuredAt: entry.measuredAt.toISOString(),
    }));
  }
}
