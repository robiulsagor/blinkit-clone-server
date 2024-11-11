const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div style="width: 100%; max-width: 600px; margin: 10px auto; background-color: #ffffff; padding: 20px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; font-family: 'Arial', sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; font-size: 28px; margin-bottom: 10px;">Password Recovery Request</h1>
        </div>
        <div style="font-size: 16px; line-height: 1.6; color: #555;">
            <p>Hi <strong style="color: #007bff;">${name}</strong>,</p>
            <p>We received a request to reset your password for your account on <strong>blinkit-clone</strong>.</p>
            <p>If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
            <p>To reset your password, enter the OPT:</p>
            <p style="text-align: center; background: #469; color:#fff; font-weight: bold; font-size: 30px; padding: 20px; border-radius: 6px;">
              ${otp}
            </p>
            <p style="text-align: center; font-size: 14px; color: #888;">This link will expire in <strong>1 hour</strong> for your security. If you don't reset your password within that time, you can request a new otp.</p>
        </div>
        <div style="border-top: 2px solid #f1f1f1; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
            <p>&copy; 2024 <strong>Blinkit Clone App</strong>. All rights reserved.</p>
        </div>
    </div>`
}

export default forgotPasswordTemplate;