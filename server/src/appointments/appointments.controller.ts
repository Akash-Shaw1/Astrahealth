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
  Patch,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AppointmentsService } from './appointments.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api/appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('familyMemberId') familyMemberId?: string,
  ) {
    return this.service.findAll(user.id, { status, familyMemberId });
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() data: any) {
    return this.service.create(user.id, data);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.service.update(user.id, id, data);
  }

  @Patch(':id/cancel')
  async cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.cancel(user.id, id);
  }
}
