import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { to, subject, html } = JSON.parse(event.body || "{}");

    console.log(`[Netlify Function] Attempting to send email to: ${to}`);

    if (resend) {
      // Validation: Ensure required fields are present
      if (!to || !subject || !html) {
        const missing = [];
        if (!to) missing.push("recipient");
        if (!subject) missing.push("subject");
        if (!html) missing.push("content");
        
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            success: false, 
            error: { name: "validation_error", message: `Missing mandatory fields: ${missing.join(", ")}` } 
          }),
        };
      }

      const { data, error } = await resend.emails.send({
        from: "SpaceX Vault <onboarding@resend.dev>",
        to: Array.isArray(to) ? to : [to],
        subject: String(subject),
        html: String(html),
      });

      if (error) {
        console.error("[Resend Error Detail]", JSON.stringify(error, null, 2));
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, error }),
        };
      }
      
      console.log("[Resend Success]", data);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data }),
      };
    } else {
      console.log(`[SIMULATION] Email to ${to} ("${subject}") simulated successfully.`);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          simulated: true,
          message: "Email simulated. To send real emails, please provide a RESEND_API_KEY in Netlify environment variables." 
        }),
      };
    }
  } catch (err: any) {
    console.error("[Function Error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
