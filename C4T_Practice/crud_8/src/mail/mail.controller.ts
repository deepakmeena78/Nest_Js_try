import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('/send')
  async sendMail(
    @Body() body: { email: string; subject: string; template: string },
  ) {
    return this.mailService.sendMail(
      { email: body.email, subject: body.subject },
      body.template,
    );
  }
}
