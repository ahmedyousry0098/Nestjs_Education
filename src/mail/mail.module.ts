import {Module} from '@nestjs/common'
import {MailService} from './mail.service'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
              host: 'smtp.gmail.com',
              service: 'gmail',
              auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS,
              },
            },
            defaults: {
              from: '"Someone" <ahmedyousry098@gmail.com>'
            }
          })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}