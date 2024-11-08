import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, body }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BlinkIt <support@rBlinkIt.test>',
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