import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FamilyMembersService } from './family-members.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api/family-members')
export class FamilyMembersController {
  constructor(private service: FamilyMembersService) {}

  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.service.findAll(user.id);
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
  async update(@CurrentUser() user: User, @Param('id') id: string, @Body() data: any) {
    return this.service.update(user.id, id, data);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    try {
      return await this.service.remove(user.id, id);
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }
}
