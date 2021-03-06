// Configure .env file
import dotenv from "dotenv";
import { createTransport } from "nodemailer";
// @ts-ignore
import hbs from "nodemailer-express-handlebars";
import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "sib-api-v3-typescript";

const result = dotenv.config();

/**
 * Interface for email helpers
 *
 * This allows for easy swapping of email services if needed as the services will only need to implement this interface.
 */
export interface emailHelper {
  sendOfferToTa(data: {
    recipient: string;
    content: { name: string; activity: string; unit: string };
  }): any;
  replyToLecturer(data: {
    recipient: string;
    content: {
      lecturerName: string;
      staffName: string;
      activity: string;
      unit: string;
    };
  }): any;
  swapRejection(data: {
    recipient: string;
    content: {
      name: string;
      from: string;
      into: string;
      unit: string;
      rejectedBy: string;
    };
  }): any;
}

/**
 * Sendinblue implementation
 * Note:
 * - WIP, incomplete implementation
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
  swapRejection(data: {
    recipient: string;
    content: {
      name: string;
      from: string;
      into: string;
      unit: string;
    };
  }) {
    throw new Error("Method not implemented.");
  }
  replyToLecturer(data: {
    recipient: string;
    content: {
      lecturerName: string;
      staffName: string;
      activity: string;
      unit: string;
    };
  }) {
    throw new Error("Method not implemented.");
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
  async swapRejection(data: {
    recipient: string;
    content: {
      name: string;
      from: string;
      into: string;
      unit: string;
    };
  }) {
    const { recipient, content } = data;
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: data.recipient,
      subject: "Swap Rejection - Monash Tutor Allocation System",
      template: "swapRejection",
      context: {
        name: content.name,
        from: content.from,
        into: content.into,
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

  // send email to TA once lecturer approve the offer
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

  // send email to lecturer once TA accepted the offer
  async replyToLecturer(data: {
    recipient: string;
    content: {
      lecturerName: string;
      staffName: string;
      activity: string;
      unit: string;
    };
  }) {
    const { recipient, content } = data;
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: recipient,
      subject: "Accepting Offer - Monash Tutor Allocation System",
      template: "replyToLecturer",
      context: {
        lecturerName: content.lecturerName,
        staffName: content.staffName,
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
}
