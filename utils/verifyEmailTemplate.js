const verifyEmailTemplate = ({ name, url }) => {
    return `
    <p style="marin: 0; padding:0"> Dear ${name},</p>
    <p  style="marin: 0; padding:0"> Thank you for registering with us. Please click on the link below to activate your account.</p>
    <a href=${url} style="color: white; background: blue; padding: 5px 10px; margin-top: 14px; border-radius: 10px; text-decoration: none"> Verify Email </a>
    `
}

export default verifyEmailTemplate 