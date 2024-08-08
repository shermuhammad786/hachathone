import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";



export const sendEmail = async ({ email, subject, template, replacements }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
                user: process.env.PORTAL_EMAIL,
                pass: process.env.PORTAL_PASSWORD,
            },
    });

    const readHTMLFile = (path) => {
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
