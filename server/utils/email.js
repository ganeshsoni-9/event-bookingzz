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

// ---------------- BOOKING CONFIRMATION EMAIL (FULL TICKET) ----------------
const sendBookingEmail = async (userEmail, ticketDetails) => {
  const {
    userName,
    eventTitle,
    eventDate,
    eventLocation,
    seats,
    amount,
    transactionId,
    bookingId
  } = ticketDetails;

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  try {
    await sendViaBrevo({
      to: userEmail,
      subject: `Your Ticket - ${eventTitle}`,
      html: `
        <div style="font-family:Arial, sans-serif; max-width:480px; margin:0 auto; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
          
          <div style="background:#0f172a; color:#fff; padding:24px; text-align:center;">
            <p style="margin:0; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#94a3b8;">Eventora</p>
            <h1 style="margin:8px 0 0; font-size:20px;">✓ Payment Successful</h1>
          </div>

          <div style="padding:24px;">
            <p style="margin:0 0 20px; color:#334155;">Hi ${userName}, your ticket is confirmed!</p>

            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:8px 0; color:#64748b;">Event</td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; color:#0f172a;">${eventTitle}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#64748b;">Date</td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; color:#0f172a;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#64748b;">Location</td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; color:#0f172a;">${eventLocation}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#64748b;">Seats</td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; color:#0f172a;">${seats}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#64748b;">Amount Paid</td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; color:#16a34a;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#64748b;">UTR / Transaction ID</td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; color:#0f172a;">${transactionId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#64748b;">Booking ID</td>
                <td style="padding:8px 0; text-align:right; font-family:monospace; font-size:12px; color:#0f172a;">${bookingId}</td>
              </tr>
            </table>

            <p style="margin-top:24px; font-size:12px; color:#94a3b8; text-align:center;">
              Please keep this email as your entry proof. Thank you for choosing Eventora.
            </p>
          </div>
        </div>
      `,
    });
    console.log("Ticket email sent to:", userEmail);
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