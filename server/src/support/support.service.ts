import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  // --- HEALTH CAMPAIGNS ---

  parseCampaign(c: any) {
    if (!c) return null;
    return {
      ...c,
      vaccines: JSON.parse(c.vaccines || '[]'),
    };
  }

  async findAllCampaigns(query: { type?: string; search?: string }) {
    const whereClause: any = {};
    if (query.type && query.type !== 'all') {
      whereClause.type = query.type;
    }
    if (query.search) {
      whereClause.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { organiser: { contains: query.search } },
      ];
    }

    const list = await this.prisma.healthCampaign.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' },
    });

    return list.map(this.parseCampaign.bind(this));
  }

  async registerForCampaign(userId: string, campaignId: string, familyMemberId?: string) {
    const campaign = await this.prisma.healthCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const existing = await this.prisma.campaignRegistration.findFirst({
      where: {
        userId,
        campaignId,
        familyMemberId: familyMemberId || null,
      },
    });
    if (existing) throw new ConflictException('Already registered for this campaign');

    return this.prisma.campaignRegistration.create({
      data: {
        userId,
        campaignId,
        familyMemberId: familyMemberId || null,
        status: 'registered',
      },
    });
  }

  async cancelCampaignRegistration(userId: string, campaignId: string, familyMemberId?: string) {
    const registration = await this.prisma.campaignRegistration.findFirst({
      where: {
        userId,
        campaignId,
        familyMemberId: familyMemberId || null,
      },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    await this.prisma.campaignRegistration.delete({
      where: { id: registration.id },
    });
    return { success: true };
  }

  async getMyCampaignRegistrations(userId: string) {
    return this.prisma.campaignRegistration.findMany({
      where: { userId },
      include: {
        campaign: true,
      },
    });
  }

  // --- FEEDBACK & REVIEWS ---

  parseFeedback(f: any) {
    if (!f) return null;
    return {
      ...f,
      ratings: JSON.parse(f.ratings || '{}'),
    };
  }

  async findFeedback(entityType?: string) {
    const whereClause: any = {};
    if (entityType && entityType !== 'all') {
      whereClause.entityType = entityType;
    }

    const list = await this.prisma.feedback.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return list.map(this.parseFeedback.bind(this));
  }

  async submitFeedback(userId: string, data: any) {
    const created = await this.prisma.feedback.create({
      data: {
        userId,
        entityType: data.entityType,
        entityId: data.entityId,
        entityName: data.entityName,
        ratings: JSON.stringify(data.ratings || { overall: 4 }),
        reviewText: data.reviewText,
        isReferral: data.isReferral || false,
        referralTo: data.referralTo || null,
        isEscalation: data.isEscalation || false,
        escalationReason: data.escalationReason || null,
      },
    });
    return this.parseFeedback(created);
  }

  // --- HEALTH GOALS ---

  async findGoals(userId: string) {
    return this.prisma.healthGoal.findMany({
      where: { userId },
    });
  }

  async createGoal(userId: string, data: any) {
    return this.prisma.healthGoal.create({
      data: {
        userId,
        title: data.title,
        target: Number(data.target),
        current: Number(data.current || 0),
        unit: data.unit,
        icon: data.icon || 'Activity',
        color: data.color || 'blue',
        streak: Number(data.streak || 0),
      },
    });
  }

  async updateGoal(userId: string, id: string, data: any) {
    const goal = await this.prisma.healthGoal.findFirst({
      where: { id, userId },
    });
    if (!goal) throw new NotFoundException('Health goal not found');

    const updateData: any = { ...data };
    if (data.target) updateData.target = Number(data.target);
    if (data.current) updateData.current = Number(data.current);
    if (data.streak) updateData.streak = Number(data.streak);

    return this.prisma.healthGoal.update({
      where: { id },
      data: updateData,
    });
  }

  async removeGoal(userId: string, id: string) {
    const goal = await this.prisma.healthGoal.findFirst({
      where: { id, userId },
    });
    if (!goal) throw new NotFoundException('Health goal not found');

    await this.prisma.healthGoal.delete({ where: { id } });
    return { success: true };
  }

  // --- EDUCATION HUB PROGRESS ---

  async getEducationProgress(userId: string) {
    return this.prisma.educationProgress.findMany({
      where: { userId },
    });
  }

  async updateEducationProgress(userId: string, moduleId: string, completionPercent: number) {
    const completedAt = completionPercent >= 100 ? new Date() : null;

    return this.prisma.educationProgress.upsert({
      where: {
        userId_moduleId: { userId, moduleId },
      },
      update: {
        completionPercent,
        lastAccessedAt: new Date(),
        completedAt,
      },
      create: {
        userId,
        moduleId,
        completionPercent,
        lastAccessedAt: new Date(),
        completedAt,
      },
    });
  }
}
