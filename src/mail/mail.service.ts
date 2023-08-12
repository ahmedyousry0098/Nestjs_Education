import {Injectable} from '@nestjs/common'
import {MailerService} from '@nestjs-modules/mailer'

@Injectable() 
export class MailService {
    constructor(private _MailerService: MailerService) {}

    async sendConfirmEmailLink(to: string, confirmationLink: string) {
        await this._MailerService.sendMail({
            to,
            subject: 'Hi',
            html: `<h1>welcome To Our Education Site</h1> <a href="${confirmationLink}">Confirm Yout Email</a>`
        })
    }

    async sendResetPasswordCode(to: string, code: string) {
        await this._MailerService.sendMail({
            to,
            subject: 'Hi',
            html: `<h1>welcome To Our Education Site</h1><p>Your Confirmation Code: ${code}</p>`
        })
    }

}