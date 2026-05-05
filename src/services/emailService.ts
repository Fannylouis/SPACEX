interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error('Email Dispatch Failure:', data.error);
      return { 
        success: false, 
        error: data.error,
        message: data.error?.message || 'Unknown protocol error during dispatch.'
      };
    }

    if (data.simulated) {
      console.log('Email Transmission Simulated (No API Key):', data.message);
    } else {
      console.log('Email Transmission Success:', data.data);
    }

    return data;
  } catch (error) {
    console.error('Error in email service:', error);
    return { success: false, error };
  }
}

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  return sendEmail({
    to: email,
    subject: "Welcome to SpaceX Vault",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px;">
        <h1 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Frontier</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Hello ${firstName},</p>
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Your account with SpaceX Vault has been successfully provisioned. You now have access to institutional-grade secondary market protocols.</p>
        <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #3b82f6; background-color: #111;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #fff;">SECURITY PROTOCOL ENABLED</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Your vault is protected by high-level encryption and real-time monitoring.</p>
        </div>
        <a href="${window.location.origin}/dashboard" style="display: inline-block; background-color: #3b82f6; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Access Dashboard</a>
        <p style="margin-top: 40px; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px;">
          This is an automated transmission from the SpaceX Vault Protocol.
        </p>
      </div>
    `
  });
};

export const sendLoginAlert = async (email: string) => {
  return sendEmail({
    to: email,
    subject: "Security Alert: New Login Detected",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px;">
        <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 2px;">Security Alert</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">A new login was detected on your SpaceX Vault account.</p>
        <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #f59e0b; background-color: #111;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #fff;">LOGIN DETAILS</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Time: ${new Date().toUTCString()}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Status: Secure</p>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">If this wasn't you, please reset your password immediately via the security protocol portal.</p>
        <p style="margin-top: 40px; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px;">
          SpaceX Vault Security Systems
        </p>
      </div>
    `
  });
};
export const sendTicketResponseEmail = async (email: string, subject: string, responseContent: string) => {
  return sendEmail({
    to: email,
    subject: `Response: ${subject} | SpaceX Support`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #1e3a8a;">
        <h1 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">Support Protocol Response</h1>
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 24px;">Regarding your inquiry: <strong>${subject}</strong></p>
        
        <div style="background-color: #0a0a0a; border: 1px solid #1e293b; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
          <p style="font-size: 15px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap;">${responseContent}</p>
        </div>

        <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">
          The status of your ticket has been updated to <strong>RESOLVED</strong>. If you require further assistance, please open a secondary channel via your dashboard.
        </p>

        <a href="${window.location.origin}/dashboard?tab=support" style="display: inline-block; background-color: #3b82f6; color: #000; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">View Support Dashboard</a>
        
        <p style="margin-top: 40px; font-size: 10px; color: #334155; border-top: 1px solid #1e293b; padding-top: 20px; font-family: monospace;">
          // TRANSACTION_TYPE: SUPPORT_REPLY
          // SYSTEM: SPACEX_VAULT_V4
        </p>
      </div>
    `
  });
};
