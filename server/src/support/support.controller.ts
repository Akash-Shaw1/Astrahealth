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
import { SupportService } from './support.service';
import { User } from '@prisma/client';

@UseGuards(ClerkAuthGuard)
@Controller('api')
export class SupportController {
  constructor(private service: SupportService) {}

  // --- CAMPAIGNS ---

  @Get('campaigns')
  async findAllCampaigns(
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAllCampaigns({ type, search });
  }

  @Get('campaigns/my-registrations')
  async getMyCampaignRegistrations(@CurrentUser() user: User) {
    return this.service.getMyCampaignRegistrations(user.id);
  }

  @Post('campaigns/:id/register')
  @HttpCode(HttpStatus.OK)
  async registerForCampaign(
    @CurrentUser() user: User,
    @Param('id') campaignId: string,
    @Body('familyMemberId') familyMemberId?: string,
  ) {
    return this.service.registerForCampaign(user.id, campaignId, familyMemberId);
  }

  @Delete('campaigns/:id/register')
  async cancelCampaignRegistration(
    @CurrentUser() user: User,
    @Param('id') campaignId: string,
    @Query('familyMemberId') familyMemberId?: string,
  ) {
    return this.service.cancelCampaignRegistration(user.id, campaignId, familyMemberId);
  }

  // --- FEEDBACK & REVIEWS ---

  @Get('feedback')
  async findFeedback(@Query('entityType') entityType?: string) {
    return this.service.findFeedback(entityType);
  }

  @Post('feedback')
  async submitFeedback(@CurrentUser() user: User, @Body() data: any) {
    return this.service.submitFeedback(user.id, data);
  }

  // --- HEALTH GOALS ---

  @Get('goals')
  async findGoals(@CurrentUser() user: User) {
    return this.service.findGoals(user.id);
  }

  @Post('goals')
  async createGoal(@CurrentUser() user: User, @Body() data: any) {
    return this.service.createGoal(user.id, data);
  }

  @Put('goals/:id')
  async updateGoal(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.service.updateGoal(user.id, id, data);
  }

  @Delete('goals/:id')
  async removeGoal(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.removeGoal(user.id, id);
  }

  // --- EDUCATION HUB PROGRESS ---

  @Get('education/progress')
  async getEducationProgress(@CurrentUser() user: User) {
    return this.service.getEducationProgress(user.id);
  }

  @Put('education/progress/:moduleId')
  async updateEducationProgress(
    @CurrentUser() user: User,
    @Param('moduleId') moduleId: string,
    @Body('completionPercent') completionPercent: number,
  ) {
    return this.service.updateEducationProgress(user.id, moduleId, completionPercent || 0);
  }
}
