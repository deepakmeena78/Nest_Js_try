import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    StudentModule, // ✅ Import StudentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
