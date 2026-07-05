import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConsultationsService } from './consultations.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api')
export class ConsultationsController {
  constructor(private service: ConsultationsService) {}

  // 1. Get stats
  @Get('consultations/stats')
  async getStats(@CurrentUser() user: User) {
    return this.service.getStats(user.id);
  }

  // 2. Get upcoming consultations
  @Get('consultations/upcoming')
  async getUpcoming(@CurrentUser() user: User) {
    return this.service.getUpcoming(user.id);
  }

  // 3. Consultations list
  @Get('consultations')
  async findAllConsultations(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.service.findAllConsultations(user.id, { status, doctorId });
  }

  // 4. Consultation detail
  @Get('consultations/:id')
  async findOneConsultation(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOneConsultation(user.id, id);
  }

  // 5. Schedule consultation
  @Post('consultations')
  async createConsultation(@CurrentUser() user: User, @Body() data: any) {
    return this.service.createConsultation(user.id, data);
  }

  // 6. Update consultation details
  @Put('consultations/:id')
  async updateConsultation(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.service.updateConsultation(user.id, id, data);
  }

  // 7. Delete consultation record
  @Delete('consultations/:id')
  async deleteConsultation(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.deleteConsultation(user.id, id);
  }

  // 8. Doctors list
  @Get('doctors')
  async findAllDoctors(
    @Query('search') search?: string,
    @Query('specialty') specialty?: string,
  ) {
    return this.service.findAllDoctors(search, specialty);
  }

  // 9. Doctor detail
  @Get('doctors/:id')
  async findOneDoctor(@Param('id') id: string) {
    return this.service.findOneDoctor(id);
  }

  // 10. Doctor availability slots
  @Get('doctors/:id/availability')
  async getAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.service.getAvailability(id, date);
  }
}
