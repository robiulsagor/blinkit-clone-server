const verifyEmailTemplate = ({ name, url }) => {
    return `
    <p> Dear ${name}</p>,
    <p> Thank you for registering with us. Please click on the link below to activate your account.</p>,
    <a href=${url} style="color: white; background: blue; padding: 5px 10px; margin-top: 14px"> Verify Email </a>
    `
}

export default verifyEmailTemplate 