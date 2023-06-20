import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendEmailConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to AirDrop Factory! Confirm your Email',
      template: './confirmation.hbs',
      context: {
        name: user.name,
        url: `http://192.168.43.222:1000/thanks?id=${user.id}`,
      },
    })
  }
}
