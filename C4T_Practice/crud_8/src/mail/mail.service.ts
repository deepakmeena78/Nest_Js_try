import { Injectable } from '@nestjs/common';
import { Helpers } from './Helper.mail';

@Injectable()
export class MailService {
  constructor(private helper: Helpers) {}

  async sendMail(data: { email: string; subject: string }, template: string) {
    try {
      await this.helper.sendMail(data, template);
      return { message: 'Mail Send Successfuly' };
    } catch (error) {
      console.log('Email Send Error : ', error);
      throw error;
    }
  }
}

