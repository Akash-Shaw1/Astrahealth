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
import { RecordsService } from './records.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api/records')
export class RecordsController {
  constructor(private service: RecordsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('familyMemberId') familyMemberId?: string,
    @Query('recordType') recordType?: string,
    @Query('category') category?: string,
  ) {
    return this.service.findAll(user.id, { familyMemberId, recordType, category });
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

  // Mock Upload Endpoint (returns standard PDF/Image mockup references)
  @Post(':id/upload')
  @HttpCode(HttpStatus.OK)
  async uploadFile(@CurrentUser() user: User, @Param('id') id: string, @Body() body: any) {
    // Generate a mock storage URL representing an uploaded document
    const fileName = body.fileName || 'Blood_Report.pdf';
    const fileSize = body.fileSize || '2.4 MB';
    const mockUrl = `/mock-records/${Date.now()}_${fileName}`;

    // Update record with mock uploaded file URL
    await this.service.update(user.id, id, {
      fileUrl: mockUrl,
      fileSize,
      status: 'Final',
    });

    return { fileUrl: mockUrl, fileSize, status: 'Final' };
  }
}
