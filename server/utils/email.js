const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Booking Confirmation Email
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await resend.emails.send({
      from: "Eventora <onboarding@resend.dev>",
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

    await resend.emails.send({
      from: "Eventora <onboarding@resend.dev>",
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