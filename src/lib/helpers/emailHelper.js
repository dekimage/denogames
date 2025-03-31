import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.html - Email HTML content
 * @param {string} [params.from] - Sender email (optional, uses default if not provided)
 * @returns {Promise<{ success: boolean, data?: any, error?: any }>}
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = "Deno Games <shop.denogames.com>",
}) {
  try {
    console.log("Sending email to:", to);

    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.log("Failed to send email:", error);
    return { success: false, error };
  }
}
