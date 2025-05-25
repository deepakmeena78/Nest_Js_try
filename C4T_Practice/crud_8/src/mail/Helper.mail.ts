import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class Helpers {
  async sendMail(data: { email: string; subject: string }, template: string) {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: 'deepakmeenaa78@gmail.com',
        pass: 'cjys vcpn jptc olqe',
      },
      secure: true,
    });

    console.log('Helper Forder Run');

    const mailData = {
      from: 'deepakmeenaa78@gmail.com',
      to: data.email,
      subject: data.subject,
      html: template,
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    return;
  }
}
