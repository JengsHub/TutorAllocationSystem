import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "sib-api-v3-typescript";
import { createTransport, SendMailOptions } from "nodemailer";

/**
 * Interface for email helpers
 *
 * This allows for easy swapping of email services if needed.
 */
interface emailHelper {
  sendRegisterConfirmation(content: { recipient: string; name: string }): any;
}

/**
 * Sendinblue implementation
 * Note:
 * - typescript/nodejs API clients documentation seem not to be up-to-date
 * - require domain name for SMTP server to send transactional email
 */
export class SibEmailHelper implements emailHelper {
  private apiKey: string;
  private templateIds = {
    registerConfirmation: 2,
  };
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendRegisterConfirmation(content: { recipient: string; name: string }) {
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, this.apiKey);
    let sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail = {
      to: [
        {
          email: content.recipient,
          name: content.name,
        },
      ],
      templateId: this.templateIds.registerConfirmation,
      params: {
        name: content.name,
      },
      headers: {
        "X-Mailin-custom":
          "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
      },
    };

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`API called successfully. Returned data: ${data}`);
    } catch (e) {
      console.log(e);
    }
  }
}

export class NodemailerEmailHelper implements emailHelper {
  /**
   * This is a basic setup using a normal Gmail account.
   * In production, we should have a dedicated SMTP server or service provider like SendGrid
   * for better mail management, quota, etc.
   */
  private transporter = createTransport({
    service: "gmail",
    auth: {
      user: "fit3170tas@gmail.com",
      pass: "}zT#JC3]8ke#G`*:", // TODO: in .env file instead
    },
  });

  async sendRegisterConfirmation(content: { recipient: string; name: string }) {
    const mailOptions: SendMailOptions = {
      from: "fit3170tas@gmail.com",
      to: content.recipient,
      subject: "Registration confirmation - Monash Tutor Allocation System",
      text: "Registered!", // TODO: template with handlebars?
    };
    try {
      const data = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", data);
    } catch (e) {
      console.log(e);
    }
  }
}
