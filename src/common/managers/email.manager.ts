import {nodemailerService} from "../adapters/nodemailer.service";
import {emailTemplates} from "../adapters/emailTemplates";
import {Result} from "../types/result.type";

export const emailManager = {
    async sendRegistrationConfirmationEmail(email: string, code: string): Promise<Result<boolean>> {
        const subject = 'Confirmation email';
        return  nodemailerService.sendEmail(email, subject, code, emailTemplates.registrationTemplate)
    }
}