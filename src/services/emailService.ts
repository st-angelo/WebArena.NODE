import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions: Mail.Options = {
    from: 'Angelo <megid@web-arena.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
