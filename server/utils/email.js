const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP Connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// =======================
// Booking Confirmation Email
// =======================
async function sendBookingEmail(userEmail, userName, eventTitle) {
  try {
    const mailOptions = {
      from: `"Event Booking" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
          <h2>Hello ${userName} 👋</h2>

          <p>Your booking for the event
            <strong>${eventTitle}</strong>
            has been confirmed successfully.
          </p>

          <p>Thank you for choosing <strong>Eventora</strong>.</p>

          <br>

          <p style="color:#777;">
            We look forward to seeing you at the event.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking email sent successfully to ${userEmail}`);
  } catch (error) {
    console.error("Error sending booking email:", error);
  }
}

// =======================
// OTP Email
// =======================
async function sendOTPEmail(toEmail, otp, type = "account_verification") {
  try {
    const isAccountVerification = type === "account_verification";

    const subject = isAccountVerification
      ? "Your Account Verification OTP"
      : "Event Booking Verification OTP";

    const heading = isAccountVerification
      ? "Account Verification"
      : "Booking Verification";

    const message = isAccountVerification
      ? "Use the OTP below to verify your Eventora account."
      : "Use the OTP below to confirm your event booking.";

    const mailOptions = {
      from: `"Event Booking" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
          
          <h2 style="text-align:center;">${heading}</h2>

          <p>${message}</p>

          <div style="
            text-align:center;
            background:#f5f5f5;
            padding:15px;
            margin:20px 0;
            border-radius:6px;
          ">
            <span style="
              font-size:32px;
              letter-spacing:6px;
              font-weight:bold;
              color:#2e7d32;
            ">
              ${otp}
            </span>
          </div>

          <p>This OTP will expire in <strong>10 minutes</strong>.</p>

          <p style="font-size:12px; color:#888;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`OTP sent successfully to ${toEmail} (${type})`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
}

// =======================
// Exports
// =======================
module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};