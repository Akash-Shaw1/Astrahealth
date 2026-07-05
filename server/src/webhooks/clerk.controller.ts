import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/webhooks')
export class ClerkWebhookController {
  private webhookSecret = process.env.CLERK_WEBHOOK_SECRET || 'whsec_demo_secret_key';

  constructor(private prisma: PrismaService) {}

  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    // Capture the raw body buffer from request
    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body not captured. Check main.ts config.');
    }

    const payload = rawBody.toString('utf8');
    const headers = {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    };

    const wh = new Webhook(this.webhookSecret);
    let event: any;

    try {
      // Verify signature
      event = wh.verify(payload, headers);
    } catch (err) {
      console.error('Svix Webhook Verification Failed:', err.message);
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid signature' });
    }

    const { type, data } = event;
    console.log(`Clerk Webhook Event Received: ${type}`);

    try {
      switch (type) {
        case 'user.created': {
          const clerkUserId = data.id;
          const email = data.email_addresses[0]?.email_address;
          const firstName = data.first_name || '';
          const lastName = data.last_name || '';
          const avatarUrl = data.image_url || '';

          if (!email) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User has no email' });
          }

          // Create User in local database (upsert to handle resilient auto-creation fallback)
          const dbUser = await this.prisma.user.upsert({
            where: { clerkUserId },
            update: {
              email,
              firstName,
              lastName,
              avatarUrl,
            },
            create: {
              clerkUserId,
              email,
              firstName,
              lastName,
              avatarUrl,
              onboardingComplete: false,
            },
          });

          // Check if "Self" Family Member exists, otherwise create it
          const selfExists = await this.prisma.familyMember.findFirst({
            where: { userId: dbUser.id, relationship: 'Self' },
          });

          if (!selfExists) {
            await this.prisma.familyMember.create({
              data: {
                userId: dbUser.id,
                name: `${firstName} ${lastName}`.trim() || 'Self',
                relationship: 'Self',
                email,
                phone: data.phone_numbers?.[0]?.phone_number || null,
              },
            });
          }
          break;
        }

        case 'user.updated': {
          const clerkUserId = data.id;
          const email = data.email_addresses[0]?.email_address;
          const firstName = data.first_name || '';
          const lastName = data.last_name || '';
          const avatarUrl = data.image_url || '';

          const existingUser = await this.prisma.user.findUnique({
            where: { clerkUserId },
          });

          if (existingUser) {
            await this.prisma.user.update({
              where: { clerkUserId },
              data: {
                email,
                firstName,
                lastName,
                avatarUrl,
              },
            });

            // Update associated "Self" family member name as well
            await this.prisma.familyMember.updateMany({
              where: { userId: existingUser.id, relationship: 'Self' },
              data: {
                name: `${firstName} ${lastName}`.trim() || 'Self',
                email,
              },
            });
          }
          break;
        }

        case 'user.deleted': {
          const clerkUserId = data.id;
          const existingUser = await this.prisma.user.findUnique({
            where: { clerkUserId },
          });

          if (existingUser) {
            // Soft delete or cascade hard delete
            await this.prisma.user.delete({
              where: { clerkUserId },
            });
          }
          break;
        }

        default:
          console.log(`Unhandled Clerk Event Type: ${type}`);
      }

      return res.status(HttpStatus.OK).json({ received: true });
    } catch (dbError) {
      console.error('Database Sync Error in Webhook Handler:', dbError);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Sync failed' });
    }
  }
}
