import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_demo_key',
  });

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify JWT with Clerk JWKS
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_demo_key',
      });

      const clerkUserId = decoded.sub;

      // Find user in local database
      let dbUser = await this.prisma.user.findUnique({
        where: { clerkUserId },
      });

      // Resilient Fallback: If Webhook hasn't created the user yet, auto-create it
      if (!dbUser) {
        try {
          const clerkUser = await this.clerkClient.users.getUser(clerkUserId);
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          
          if (!email) {
            throw new Error('User has no email address on Clerk');
          }

          dbUser = await this.prisma.user.create({
            data: {
              clerkUserId,
              email,
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
              avatarUrl: clerkUser.imageUrl,
              onboardingComplete: false,
            },
          });

          // Auto-create "Self" Family Member profile
          await this.prisma.familyMember.create({
            data: {
              userId: dbUser.id,
              name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Self',
              relationship: 'Self',
              gender: 'Unspecified',
              email,
              phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
            },
          });
        } catch (err) {
          console.error('Failed to auto-create user from Clerk API:', err);
          throw new UnauthorizedException('User profile sync pending');
        }
      }

      // Attach internal user details to request object
      request.user = dbUser;
      return true;
    } catch (error) {
      console.error('Clerk Auth Verification Error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
