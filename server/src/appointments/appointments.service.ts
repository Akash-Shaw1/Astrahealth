import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: { status?: string; familyMemberId?: string }) {
    const whereClause: any = { userId };
    
    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.familyMemberId) {
      whereClause.familyMemberId = query.familyMemberId;
    }

    return this.prisma.appointment.findMany({
      where: whereClause,
      include: {
        familyMember: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
      include: {
        familyMember: true,
        doctor: true,
      },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async create(userId: string, data: any) {
    const appointment = await this.prisma.appointment.create({
      data: {
        userId,
        familyMemberId: data.familyMemberId,
        doctorId: data.doctorId || null,
        doctorName: data.doctorName,
        date: new Date(data.date),
        time: data.time,
        duration: data.duration || 30,
        type: data.type,
        status: data.status || 'Scheduled',
        appointmentMode: data.appointmentMode,
        location: data.location,
        reason: data.reason,
        notes: data.notes || null,
      },
    });
    return appointment;
  }

  async update(userId: string, id: string, data: any) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async cancel(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'Cancelled' },
    });
  }
}
