import { Module } from '@nestjs/common';
import { RbiController } from './rbi.controller';
import { RbiService } from './rbi.service';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [RbiController],
  providers: [RbiService],
})
export class RbiModule {}
 