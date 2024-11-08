import { Resend } from 'resend';
import dotenv from "dotenv"
dotenv.config()

if (!process.env.RESEND_API) {
    console.log("Provide RESEND_API in side the .env file")
    throw new Error("Please provide a RESEND api key")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, body }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BlinkIt <onboarding@resend.dev>',
            to: sendTo,
            subject,
            html: body,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error);

    }

}

export default sendEmail