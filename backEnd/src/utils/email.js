const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Base email wrapper
const getBaseEmailTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 6px;">
    <h2 style="color: #007bff; text-align: center;">HD Notes</h2>
    <div style="margin-top: 20px;">
      ${content}
    </div>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    <p style="font-size: 13px; color: #555; text-align: center;">
      Best regards,<br>HD Notes Team
    </p>
  </div>
`;

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();

    const content = `
      <p>Hello <b>${name}</b>,</p>
      <p>Your OTP for HD Notes is:</p>
      <h1 style="text-align: center; color: #007bff;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `;

    const mailOptions = {
      from: `"HD Notes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for HD Notes',
      html: getBaseEmailTemplate(content)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const content = `
      <p>Welcome <b>${name}</b>,</p>
      <p>Your account has been created and verified successfully. You can now start using HD Notes.</p>
      <ul>
        <li>Email verified</li>
        <li>Account ready to use</li>
      </ul>
      <p>Start creating your first note today!</p>
    `;

    const mailOptions = {
      from: `"HD Notes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to HD Notes!',
      html: getBaseEmailTemplate(content)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};
