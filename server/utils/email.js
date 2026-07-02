const dotenv = require("dotenv");
dotenv.config();
 
// Brevo sends over HTTPS (port 443), so it works fine on Render's free plan
// (which blocks SMTP ports 25/465/587). Free tier = 300 emails/day.
 
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
 
// This MUST be the exact Gmail address you verified as a "Sender" in Brevo
const SENDER_EMAIL = process.env.EMAIL_USER; // e.g. yourname@gmail.com
const SENDER_NAME = "Eventora";
 
const sendViaBrevo = async ({ to, subject, html }) => {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
 
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Brevo Error (${response.status}): ${errBody}`);
  }
 
  return response.json();
};
 
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await sendViaBrevo({
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
 
const sendOTPEmail = async (userEmail, otp, type = "account_verification") => {
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
 
    await sendViaBrevo({
      to: userEmail,
      subject,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>${heading}</h2>
          <p>${message}</p>
          <h1 style="letter-spacing:5px;color:green;">${otp}</h1>
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
 
module.exports = { sendBookingEmail, sendOTPEmail };