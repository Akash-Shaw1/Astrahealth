import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { UsersModule } from './users/users.module';
import { FamilyMembersModule } from './family-members/family-members.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { RecordsModule } from './records/records.module';
import { MedicationsModule } from './medications/medications.module';
import { VitalsModule } from './vitals/vitals.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    PrismaModule,
    WebhooksModule,
    UsersModule,
    FamilyMembersModule,
    AppointmentsModule,
    ConsultationsModule,
    RecordsModule,
    MedicationsModule,
    VitalsModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
