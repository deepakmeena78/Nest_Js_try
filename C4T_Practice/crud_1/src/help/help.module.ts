import { Module } from '@nestjs/common';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { help, helpSchema } from './HelpSchema/help';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Help', schema: helpSchema }])],
  providers: [HelpService],
  controllers: [HelpController],
})
export class HelpModule {}
