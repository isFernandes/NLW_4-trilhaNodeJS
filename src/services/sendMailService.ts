import nodemailer, { Transporter } from "nodemailer";
import path from 'path';
import handlebars from "handlebars"
import fs from "fs"

class SendMailService {
    private client: Transporter
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
            this.client = transporter;
        })
    }

    async execute(to: string, subject: string, body: string) {
        //gettando caminho do email view
        const npsPath = path.resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        //realizando leitura do arquivo no formato utf8
        const templateFileContent = fs.readFileSync(npsPath).toString("utf8");

        //handlebars compilando arquivo lido
        const mailTemplateParse = handlebars.compile(templateFileContent);

        //passando ao arquivo transformado as variaveis faltantes
        const html = mailTemplateParse({ name: to, title: subject, description: body })

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from:"NPS <noreplay@npsjobsea.com.br>"
        });

        console.log('Message sent: %s', message.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService;