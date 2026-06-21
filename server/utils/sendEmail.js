const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: `"Your App Name" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Account Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Account Verification</h2>
        <p>Aapka OTP code hai:</p>
        <h1 style="letter-spacing: 4px; color: #2e7d32;">${otp}</h1>
        <p>Ye OTP 10 minute mein expire ho jayega.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail;