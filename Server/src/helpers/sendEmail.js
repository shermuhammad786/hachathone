import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";

type EmailParams = {
  email: string;
  subject: string;
  template: string;
  replacements: Record<string, any>;
};

export const sendEmail = async ({ email, subject, template, replacements }: EmailParams): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
                user: process.env.PORTAL_EMAIL,
                pass: process.env.PORTAL_PASSWORD,
            },
    });

    const readHTMLFile = (path: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
          if (err) {
            reject(err);
          } else {
            resolve(html);
          }
        });
      });
    };

    const html = await readHTMLFile(`./src/public/templates/${template}.html`);
    const templateCompiled = handlebars.compile(html);
    const htmlToSend = templateCompiled(replacements);

    await transporter.sendMail({
      from: process.env.PORTAL_EMAIL,
      to: email,
      subject: subject,
      html: htmlToSend,
    });

  } catch (err) {
    console.error(err ,"=== error");
  }
};
