import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VitalsService } from './vitals.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api/vitals')
export class VitalsController {
  constructor(private service: VitalsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('familyMemberId') familyMemberId?: string,
    @Query('days') days?: string,
  ) {
    return this.service.findAll(user.id, {
      familyMemberId,
      days: days ? Number(days) : undefined,
    });
  }

  @Get('trends')
  async getTrends(
    @CurrentUser() user: User,
    @Query('familyMemberId') familyMemberId: string,
    @Query('days') days?: string,
  ) {
    return this.service.getTrends(user.id, familyMemberId, days ? Number(days) : 30);
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() data: any) {
    return this.service.create(user.id, data);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
