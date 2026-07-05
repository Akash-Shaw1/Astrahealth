import {
  Controller,
  Get,
  Put,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 1. Health check (Public, used by client auto-fallback toggle)
  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  // 2. Fetch current user profile
  @UseGuards(ClerkAuthGuard)
  @Get('users/me')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.getMe(user.clerkUserId);
  }

  // 3. Update user profile
  @UseGuards(ClerkAuthGuard)
  @Put('users/me')
  async updateProfile(@CurrentUser() user: User, @Body() updateData: any) {
    return this.usersService.updateMe(user.clerkUserId, updateData);
  }

  // 4. Save onboarding partial draft
  @UseGuards(ClerkAuthGuard)
  @Patch('users/me/onboarding/draft')
  async saveDraft(@CurrentUser() user: User, @Body() draft: any) {
    return this.usersService.saveOnboardingDraft(user.clerkUserId, draft);
  }

  // 5. Complete onboarding
  @UseGuards(ClerkAuthGuard)
  @Post('users/me/onboarding')
  async completeOnboarding(@CurrentUser() user: User, @Body() onboardingData: any) {
    return this.usersService.completeOnboarding(user.clerkUserId, onboardingData);
  }
}
