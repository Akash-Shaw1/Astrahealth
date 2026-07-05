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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MedicationsService } from './medications.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api/medications')
export class MedicationsController {
  constructor(private service: MedicationsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('familyMemberId') familyMemberId?: string,
  ) {
    return this.service.findAll(user.id, { familyMemberId });
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

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  async complete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.complete(user.id, id);
  }

  @Post(':id/refill')
  @HttpCode(HttpStatus.OK)
  async refill(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('additionalDoses') additionalDoses: number,
  ) {
    return this.service.refill(user.id, id, additionalDoses || 10);
  }

  @Post(':id/take-dose')
  @HttpCode(HttpStatus.OK)
  async takeDose(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.service.takeDose(user.id, id, amount || 1);
  }
}
