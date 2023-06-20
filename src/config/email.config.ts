import { MailerOptions } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigService } from '@nestjs/config'
import { path } from 'app-root-path'

export const getEmailConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    host: 'smtp.mail.ru',
    auth: {
      user: configService.get('EMAIL_USER'),
      pass: configService.get('EMAIL_PASSWORD'),
    },
  },
  defaults: {
    from: configService.get('EMAIL_USER'),
  },
  template: {
    dir: `${path}/src/email/templates`,
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
})
