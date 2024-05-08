import nodemailer, { type Transporter } from "nodemailer";

interface MailSenderProps {
  email: string;
  title: string;
  body: string;
}
const mailSender = async ({ email, title, body }: MailSenderProps) => {
  try {
    // Create a Transporter to send emails
    const transporter: Transporter = nodemailer.createTransport({
      service: "Gmail",
      host: process.env.MAIL_HOST!,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
      },
    });
    // Send emails to users
    const info: nodemailer.SentMessageInfo = await transporter.sendMail({
      from: "Vibhor <i.am@vibhor.tech>",
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error);
  }
};

export default mailSender;
