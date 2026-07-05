import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  // Helper to parse Consultation DB fields
  parseConsultation(c: any) {
    if (!c) return null;
    return {
      ...c,
      attachments: JSON.parse(c.attachments || '[]'),
    };
  }

  // Helper to parse Doctor DB fields
  parseDoctor(d: any) {
    if (!d) return null;
    return {
      ...d,
      languages: JSON.parse(d.languages || '[]'),
      availability: JSON.parse(d.availability || '{}'),
    };
  }

  // 1. List consultations
  async findAllConsultations(userId: string, query: { status?: string; doctorId?: string }) {
    const whereClause: any = { userId };
    if (query.status && query.status !== 'all') {
      whereClause.status = query.status;
    }
    if (query.doctorId) {
      whereClause.doctorId = query.doctorId;
    }

    const list = await this.prisma.consultation.findMany({
      where: whereClause,
      include: {
        familyMember: { select: { name: true, avatar: true } },
        doctor: { select: { name: true, avatar: true, specialty: true } },
      },
      orderBy: { date: 'desc' },
    });

    return list.map(this.parseConsultation.bind(this));
  }

  // 2. Get consultation detail
  async findOneConsultation(userId: string, id: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id, userId },
      include: {
        familyMember: true,
        doctor: true,
        medicalRecords: true,
      },
    });
    if (!consultation) throw new NotFoundException('Consultation not found');
    return this.parseConsultation(consultation);
  }

  // 3. Schedule consultation
  async createConsultation(userId: string, data: any) {
    const created = await this.prisma.consultation.create({
      data: {
        userId,
        familyMemberId: data.familyMemberId,
        doctorId: data.doctorId,
        date: new Date(data.date),
        time: data.time,
        duration: data.duration || 30,
        type: data.type || 'Video Call',
        status: data.status || 'upcoming',
        severity: data.severity || 'low',
        reason: data.reason,
        notes: data.notes || null,
        patientNotes: data.patientNotes || null,
        attachments: JSON.stringify(data.attachments || []),
      },
    });
    return this.parseConsultation(created);
  }

  // 4. Update consultation (e.g. rate or add patient notes)
  async updateConsultation(userId: string, id: string, data: any) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id, userId },
    });
    if (!consultation) throw new NotFoundException('Consultation not found');

    const updateData: any = { ...data };
    if (data.attachments) {
      updateData.attachments = JSON.stringify(data.attachments);
    }

    const updated = await this.prisma.consultation.update({
      where: { id },
      data: updateData,
    });
    return this.parseConsultation(updated);
  }

  // 5. Delete consultation
  async deleteConsultation(userId: string, id: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id, userId },
    });
    if (!consultation) throw new NotFoundException('Consultation not found');

    await this.prisma.consultation.delete({ where: { id } });
    return { success: true };
  }

  // 6. Get consultation stats
  async getStats(userId: string) {
    const consultations = await this.prisma.consultation.findMany({
      where: { userId },
    });

    const total = consultations.length;
    const completed = consultations.filter((c) => c.status === 'completed').length;
    const upcoming = consultations.filter((c) => c.status === 'upcoming').length;
    const cancelled = consultations.filter((c) => c.status === 'cancelled').length;

    const completedWithRatings = consultations.filter((c) => c.status === 'completed' && c.rating !== null);
    const averageRating =
      completedWithRatings.length > 0
        ? completedWithRatings.reduce((sum, c) => sum + Number(c.rating || 0), 0) / completedWithRatings.length
        : 0;

    return {
      total,
      completed,
      upcoming,
      cancelled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  // 7. Get upcoming consultations (sorted chronologically)
  async getUpcoming(userId: string) {
    const list = await this.prisma.consultation.findMany({
      where: { userId, status: 'upcoming' },
      include: {
        familyMember: { select: { name: true, avatar: true } },
        doctor: { select: { name: true, avatar: true, specialty: true } },
      },
    });

    // Sort in memory by combining date and time if necessary, or default sort
    return list
      .map(this.parseConsultation.bind(this))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 8. Doctors list
  async findAllDoctors(search?: string, specialty?: string) {
    const whereClause: any = {};
    if (specialty) {
      whereClause.specialty = { contains: specialty };
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { specialty: { contains: search } },
      ];
    }

    const list = await this.prisma.doctor.findMany({
      where: whereClause,
    });
    return list.map(this.parseDoctor.bind(this));
  }

  // 9. Doctor detail
  async findOneDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return this.parseDoctor(doctor);
  }

  // 10. Doctor availability slots
  async getAvailability(doctorId: string, dateStr: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const parsedDoctor = this.parseDoctor(doctor);
    const date = new Date(dateStr);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availableSlots: string[] = parsedDoctor.availability[dayOfWeek] || [];

    // Filter out already booked slots
    const booked = await this.prisma.consultation.findMany({
      where: {
        doctorId,
        date: new Date(dateStr),
        status: { not: 'cancelled' },
      },
      select: { time: true },
    });

    const bookedTimes = booked.map((b) => b.time);
    return availableSlots.filter((slot) => !bookedTimes.includes(slot));
  }
}
