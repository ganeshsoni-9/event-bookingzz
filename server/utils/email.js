const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP
transporter.verify((error) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

// Booking Confirmation Email
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await transporter.sendMail({
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed - ${eventTitle}`,
      html: `
        <h2>Hello ${userName} 👋</h2>
        <p>Your booking for <strong>${eventTitle}</strong> has been confirmed successfully.</p>
        <p>Thank you for choosing <strong>Eventora</strong>.</p>
      `,
    });

    console.log("Booking email sent to:", userEmail);
  } catch (error) {
    console.error("Booking Email Error:", error);
    throw error;
  }
};

// OTP Email
const sendOTPEmail = async (
  userEmail,
  otp,
  type = "account_verification"
) => {
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
      : "Use the OTP below to verify your event booking.";

    await transporter.sendMail({
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>${heading}</h2>
          <p>${message}</p>

          <h1 style="letter-spacing:5px;color:green;">
            ${otp}
          </h1>

          <p>This OTP expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log("OTP sent to:", userEmail);
  } catch (error) {
    console.error("OTP Email Error:", error);
    throw error;
  }
};

module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};