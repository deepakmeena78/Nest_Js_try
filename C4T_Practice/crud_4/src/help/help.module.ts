import { Module } from '@nestjs/common';
import { StudentService } from './help.service';
import { StudentController } from './help.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
