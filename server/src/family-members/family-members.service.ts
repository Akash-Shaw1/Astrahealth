import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FamilyMembersService {
  constructor(private prisma: PrismaService) {}

  parseMember(member: any) {
    if (!member) return null;
    return {
      ...member,
      knownConditions: JSON.parse(member.knownConditions || '[]'),
      allergies: JSON.parse(member.allergies || '[]'),
    };
  }

  async findAll(userId: string) {
    const list = await this.prisma.familyMember.findMany({
      where: { userId, isActive: true },
    });
    return list.map(this.parseMember.bind(this));
  }

  async findOne(userId: string, id: string) {
    const member = await this.prisma.familyMember.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!member) throw new NotFoundException('Family member not found');
    return this.parseMember(member);
  }

  async create(userId: string, data: any) {
    const createData = {
      userId,
      name: data.name,
      relationship: data.relationship,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender || 'Unspecified',
      avatar: data.avatar || '/placeholder.svg',
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      knownConditions: JSON.stringify(data.knownConditions || []),
      allergies: JSON.stringify(data.allergies || []),
      bloodGroup: data.bloodGroup || null,
    };

    const created = await this.prisma.familyMember.create({
      data: createData,
    });
    return this.parseMember(created);
  }

  async update(userId: string, id: string, data: any) {
    const member = await this.prisma.familyMember.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!member) throw new NotFoundException('Family member not found');

    const updateData: any = { ...data };
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    if (data.knownConditions) {
      updateData.knownConditions = JSON.stringify(data.knownConditions);
    }
    if (data.allergies) {
      updateData.allergies = JSON.stringify(data.allergies);
    }

    const updated = await this.prisma.familyMember.update({
      where: { id },
      data: updateData,
    });
    return this.parseMember(updated);
  }

  async remove(userId: string, id: string) {
    const member = await this.prisma.familyMember.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!member) throw new NotFoundException('Family member not found');

    // Enforce that "Self" cannot be deleted
    if (member.relationship === 'Self') {
      throw new Error('Self profile cannot be deleted');
    }

    await this.prisma.familyMember.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true };
  }
}
