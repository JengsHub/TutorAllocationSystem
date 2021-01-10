import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "sib-api-v3-typescript";
import { createTransport, SendMailOptions } from "nodemailer";
// @ts-ignore
import hbs from "nodemailer-express-handlebars";

// Configure .env file
import dotenv from "dotenv";
const result = dotenv.config();

/**
 * Interface for email helpers
 *
 * This allows for easy swapping of email services if needed.
 */
interface emailHelper {
  sendRegisterConfirmation(content: { recipient: string; name: string }): any;
  sendOfferToTa(data: {
    recipient: string;
    content: { name: string; activity: string; unit: string };
  }): any;
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
  sendOfferToTa(data: {
    recipient: string;
    content: { name: string; activity: string; unit: string };
  }) {
    throw new Error("Method not implemented.");
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
  private transporter;

  constructor() {
    // create nodemailer mail transporter
    this.transporter = createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // options for nodemailer-express-handlebars to compile the templates
    const options = {
      viewEngine: {
        partialsDir: "src/email/views/partials",
        layoutsDir: "src/email/views/layouts",
        extname: ".hbs",
      },
      extName: ".hbs",
      viewPath: "src/email/views",
    };

    this.transporter.use("compile", hbs(options));
  }
  async sendOfferToTa(data: {
    recipient: string;
    content: { name: string; activity: string; unit: string };
  }) {
    const { recipient, content } = data;
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: data.recipient,
      subject: "Activity Offer - Monash Tutor Allocation System",
      template: "offerToTa",
      context: {
        name: content.name,
        activity: content.activity,
        unit: content.unit,
      },
    };
    try {
      const data = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", data);
    } catch (e) {
      console.log(e);
    }
  }

  async sendRegisterConfirmation(content: { recipient: string; name: string }) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: content.recipient,
      subject: "Registration confirmation - Monash Tutor Allocation System",
      template: "registrationConfirmation",
      context: {
        name: content.name,
      },
    };
    try {
      const data = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", data);
    } catch (e) {
      console.log(e);
    }
  }
}
