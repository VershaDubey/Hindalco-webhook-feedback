const { Resend } = require("resend");

// Check if API key exists before initializing
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY not found. Email functionality will be disabled.");
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendMail({ to, subject, html }) {
  try {
    if (!resend) {
      console.warn("⚠️  Email service not available - RESEND_API_KEY missing");
      return { error: "Email service not configured" };
    }

    if (!to || !subject || !html) {
      throw new Error("Missing required mail fields: to, subject, or html");
    }

    console.log(`📧 Sending email to ${to}`);
    const response = await resend.emails.send({
      from: "ankit.panwar@crmlanding.co.in",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = sendMail;
