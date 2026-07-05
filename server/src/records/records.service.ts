import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  // Helper to parse DB medical record fields
  parseRecord(r: any) {
    if (!r) return null;
    return {
      ...r,
      tags: JSON.parse(r.tags || '[]'),
      details: r.details ? JSON.parse(r.details) : null,
    };
  }

  async findAll(userId: string, query: { familyMemberId?: string; recordType?: string; category?: string }) {
    const whereClause: any = { userId };
    if (query.familyMemberId) {
      whereClause.familyMemberId = query.familyMemberId;
    }
    if (query.recordType) {
      whereClause.recordType = query.recordType;
    }
    if (query.category) {
      whereClause.category = query.category;
    }

    const list = await this.prisma.medicalRecord.findMany({
      where: whereClause,
      include: {
        familyMember: { select: { name: true, avatar: true } },
      },
      orderBy: { date: 'desc' },
    });

    return list.map(this.parseRecord.bind(this));
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.medicalRecord.findFirst({
      where: { id, userId },
      include: {
        familyMember: true,
        consultation: true,
      },
    });
    if (!record) throw new NotFoundException('Medical record not found');
    return this.parseRecord(record);
  }

  async create(userId: string, data: any) {
    const createData = {
      userId,
      familyMemberId: data.familyMemberId,
      consultationId: data.consultationId || null,
      recordType: data.recordType,
      title: data.title,
      date: new Date(data.date),
      doctor: data.doctor || null,
      category: data.category || null,
      status: data.status || 'Active',
      fileUrl: data.fileUrl || '/placeholder-record.pdf',
      fileSize: data.fileSize || '1.5 MB',
      description: data.description || null,
      tags: JSON.stringify(data.tags || []),
      priority: data.priority || 'Normal',
      details: data.details ? JSON.stringify(data.details) : null,
    };

    const created = await this.prisma.medicalRecord.create({
      data: createData,
    });
    return this.parseRecord(created);
  }

  async update(userId: string, id: string, data: any) {
    const record = await this.prisma.medicalRecord.findFirst({
      where: { id, userId },
    });
    if (!record) throw new NotFoundException('Medical record not found');

    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }
    if (data.details) {
      updateData.details = JSON.stringify(data.details);
    }

    const updated = await this.prisma.medicalRecord.update({
      where: { id },
      data: updateData,
    });
    return this.parseRecord(updated);
  }

  async remove(userId: string, id: string) {
    const record = await this.prisma.medicalRecord.findFirst({
      where: { id, userId },
    });
    if (!record) throw new NotFoundException('Medical record not found');

    await this.prisma.medicalRecord.delete({ where: { id } });
    return { success: true };
  }
}
