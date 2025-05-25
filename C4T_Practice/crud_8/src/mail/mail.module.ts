import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { Helpers } from './Helper.mail';

@Module({
  providers: [MailService, Helpers],
  controllers: [MailController],
})
export class MailModule {}
