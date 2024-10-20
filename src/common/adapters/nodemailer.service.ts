import nodemailer from "nodemailer";
import {appConfig} from "../config/config";
import {Result, ResultStatus} from "../types/result.type";


export const nodemailerService = {
    async sendEmail(email: string, subject: string, code: string, template:(code: string) => string): Promise<Result<boolean>> {
        const transporter = nodemailer.createTransport(appConfig.MAIL_CFG);

        try {
            const info = await transporter.sendMail({
                from: `"A hto eto?" <lazarev171193@mail.ru>`, // sender address
                to: email,
                subject: subject,
                html: template(code)
            });

            console.log("Message sent: %s", info.messageId);
            return {
                status:ResultStatus.Success,
                data: true
            }
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        } catch (err) {
            console.error(err);
            return {
                status:ResultStatus.ServiceError,
                errorMessage: 'Email did not sent',
                data: false
            }
        }

    }
}