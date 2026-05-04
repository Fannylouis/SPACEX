
/**
 * Utility to send confirmation and notification emails via the backend API.
 */
export async function sendConfirmationEmail(to: string, type: 'signup' | 'login' | 'banking' | 'withdrawal_code', data?: any) {
  let subject = '';
  let html = '';

  const timestamp = new Date().toISOString();
  const securityHash = data || Math.random().toString(36).substring(7).toUpperCase();

  switch (type) {
    case 'signup':
      subject = 'Account Initialization Success | SpaceX Asset Vault';
      html = `
        <div style="font-family: monospace; padding: 40px; background: #000; color: #fff; border: 1px solid #1e3a8a;">
          <h1 style="color: #3b82f6; font-size: 24px; text-transform: uppercase; letter-spacing: 0.2em;">SpaceX Protocol</h1>
          <p style="color: #64748b; font-size: 12px; text-transform: uppercase;">Identity: ${data?.firstName || ''} ${data?.lastName || ''}</p>
          <div style="border-top: 1px solid #1e1e1e; margin: 20px 0; padding-top: 20px;">
            <p>Your institutional vault has been successfully initialized.</p>
            <p style="color: #64748b; font-size: 10px;">Security Hash: ${securityHash}</p>
          </div>
          <p style="font-size: 10px; color: #334155;">This is an automated dispatch. Do not reply.</p>
        </div>
      `;
      break;
    case 'login':
      subject = 'Secure Access Notification | SpaceX Asset Vault';
      html = `
        <div style="font-family: monospace; padding: 40px; background: #000; color: #fff; border: 1px solid #1e3a8a;">
          <h1 style="color: #3b82f6; font-size: 24px; text-transform: uppercase; letter-spacing: 0.2em;">SpaceX Security</h1>
          <p style="color: #64748b; font-size: 10px; text-transform: uppercase;">Authorization: SUCCESS</p>
          <div style="border-top: 1px solid #1e1e1e; margin: 20px 0; padding-top: 20px;">
            <p>A secure login to your SpaceX Asset Vault was detected from a new terminal session.</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p style="color: #64748b; font-size: 10px;">Security Hash: ${securityHash}</p>
          </div>
          <p style="font-size: 10px; color: #334155;">If you did not execute this authentication, terminate your session immediately via your dashboard or contact support.</p>
        </div>
      `;
      break;
    case 'banking':
      subject = 'Secure Account Number | SpaceX Asset Vault';
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');

            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
              background: #000;
              font-family: 'Rajdhani', sans-serif;
            }

            .wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #000;
              border: 1px solid #0d2a6e;
              position: relative;
              overflow: hidden;
            }

            /* Subtle grid background */
            .wrapper::before {
              content: '';
              position: absolute;
              inset: 0;
              background-image:
                linear-gradient(rgba(29, 78, 216, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(29, 78, 216, 0.04) 1px, transparent 1px);
              background-size: 32px 32px;
              pointer-events: none;
            }

            /* Top accent bar */
            .top-bar {
              height: 3px;
              background: linear-gradient(90deg, #0d2a6e, #2563eb, #60a5fa, #2563eb, #0d2a6e);
            }

            /* Corner marks */
            .corner {
              position: absolute;
              width: 14px;
              height: 14px;
            }
            .corner-tl { top: 3px; left: 0; border-top: 1px solid #3b82f6; border-left: 1px solid #3b82f6; }
            .corner-tr { top: 3px; right: 0; border-top: 1px solid #3b82f6; border-right: 1px solid #3b82f6; }
            .corner-bl { bottom: 0; left: 0; border-bottom: 1px solid #3b82f6; border-left: 1px solid #3b82f6; }
            .corner-br { bottom: 0; right: 0; border-bottom: 1px solid #3b82f6; border-right: 1px solid #3b82f6; }

            .header {
              padding: 36px 40px 28px;
              border-bottom: 1px solid #0d2a6e;
              position: relative;
            }

            .brand-label {
              font-family: 'Share Tech Mono', monospace;
              font-size: 10px;
              letter-spacing: 4px;
              color: #1d4ed8;
              text-transform: uppercase;
              margin-bottom: 10px;
            }

            .brand-name {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 6px;
              color: #fff;
              text-transform: uppercase;
            }

            .brand-name span {
              color: #3b82f6;
            }

            .tagline {
              font-family: 'Share Tech Mono', monospace;
              font-size: 10px;
              color: #1e40af;
              letter-spacing: 2px;
              margin-top: 6px;
            }

            .header-badge {
              position: absolute;
              top: 36px;
              right: 40px;
              background: rgba(29, 78, 216, 0.1);
              border: 1px solid #1d4ed8;
              padding: 6px 14px;
              font-family: 'Share Tech Mono', monospace;
              font-size: 9px;
              color: #60a5fa;
              letter-spacing: 2px;
              text-transform: uppercase;
            }

            .body {
              padding: 36px 40px;
            }

            .greeting {
              font-size: 13px;
              font-weight: 300;
              color: #4b76c8;
              letter-spacing: 1px;
              margin-bottom: 18px;
              font-family: 'Share Tech Mono', monospace;
            }

            .message {
              font-size: 16px;
              font-weight: 300;
              color: #94a3b8;
              line-height: 1.8;
              margin-bottom: 32px;
            }

            /* Account card */
            .account-card {
              background: linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #060d1f 100%);
              border: 1px solid #1d4ed8;
              padding: 28px 32px;
              position: relative;
              margin-bottom: 32px;
            }

            .account-card::before {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 1px;
              background: linear-gradient(90deg, transparent, #3b82f6, transparent);
            }

            .card-label {
              font-family: 'Share Tech Mono', monospace;
              font-size: 9px;
              letter-spacing: 3px;
              color: #1d4ed8;
              text-transform: uppercase;
              margin-bottom: 12px;
            }

            .account-number {
              font-family: 'Share Tech Mono', monospace;
              font-size: 22px;
              letter-spacing: 5px;
              color: #e2e8f0;
              margin-bottom: 20px;
            }

            .card-meta {
              display: flex;
              gap: 40px;
            }

            .meta-item {}

            .meta-label {
              font-family: 'Share Tech Mono', monospace;
              font-size: 8px;
              letter-spacing: 2px;
              color: #1e40af;
              text-transform: uppercase;
              margin-bottom: 4px;
            }

            .meta-value {
              font-size: 13px;
              font-weight: 500;
              color: #60a5fa;
              letter-spacing: 1px;
            }

            .card-icon {
              position: absolute;
              top: 24px;
              right: 28px;
              width: 38px;
              height: 38px;
              border: 1px solid #1d4ed8;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            /* CTA button */
            .cta-wrapper {
              text-align: center;
              margin-bottom: 32px;
            }

            .cta-btn {
              display: inline-block;
              background: linear-gradient(90deg, #1d4ed8, #2563eb);
              color: #fff;
              text-decoration: none;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 3px;
              text-transform: uppercase;
              padding: 14px 40px;
              border: none;
              position: relative;
              font-family: 'Rajdhani', sans-serif;
            }

            .cta-btn::before,
            .cta-btn::after {
              content: '';
              position: absolute;
              width: 8px; height: 8px;
            }
            .cta-btn::before { top: -1px; left: -1px; border-top: 1px solid #60a5fa; border-left: 1px solid #60a5fa; }
            .cta-btn::after  { bottom: -1px; right: -1px; border-bottom: 1px solid #60a5fa; border-right: 1px solid #60a5fa; }

            /* Divider */
            .divider {
              border: none;
              border-top: 1px solid #0d1f4e;
              margin: 0 0 28px;
            }

            /* Security notice */
            .security-notice {
              background: rgba(29, 78, 216, 0.05);
              border-left: 2px solid #1d4ed8;
              padding: 14px 18px;
              margin-bottom: 32px;
            }

            .security-notice p {
              font-family: 'Share Tech Mono', monospace;
              font-size: 10px;
              color: #4b76c8;
              letter-spacing: 1px;
              line-height: 1.7;
            }

            .footer {
              padding: 24px 40px;
              border-top: 1px solid #0d1f4e;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .footer-brand {
              font-family: 'Share Tech Mono', monospace;
              font-size: 9px;
              color: #1e3a5f;
              letter-spacing: 2px;
              text-transform: uppercase;
            }

            .footer-links {
              font-family: 'Share Tech Mono', monospace;
              font-size: 9px;
              color: #1e3a5f;
              letter-spacing: 1px;
            }

            .footer-links a {
              color: #1d4ed8;
              text-decoration: none;
            }

            .bottom-bar {
              height: 2px;
              background: linear-gradient(90deg, #060d1f, #0d2a6e, #060d1f);
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="top-bar"></div>
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>

            <!-- Header -->
            <div class="header">
              <div class="brand-label">Asset Vault // Encrypted Channel</div>
              <div class="brand-name">Space<span>X</span> Banking</div>
              <div class="tagline">// INTERPLANETARY FINANCIAL INFRASTRUCTURE</div>
              <div class="header-badge">⬡ SECURE</div>
            </div>

            <!-- Body -->
            <div class="body">
              <div class="greeting">// TRANSMISSION TO: ACCOUNT HOLDER</div>
              <p class="message">
                Your secure account credentials have been verified and are ready for access. 
                This number grants entry to the SpaceX Asset Vault. Store it offline. 
                Do not share with any unauthorized personnel.
              </p>

              <!-- Account Number Card -->
              <div class="account-card">
                <div class="card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div class="card-label">// Account Number</div>
                <div class="account-number">2201 6121 7</div>
                <div class="card-meta">
                  <div class="meta-item">
                    <div class="meta-label">Ref Code</div>
                    <div class="meta-value">NX-${securityHash}</div>
                  </div>
                  <div class="meta-item">
                    <div class="meta-label">Encryption</div>
                    <div class="meta-value">AES-256</div>
                  </div>
                  <div class="meta-item">
                    <div class="meta-label">Status</div>
                    <div class="meta-value" style="color:#22c55e;">ACTIVE</div>
                  </div>
                </div>
              </div>

              <!-- CTA -->
              <div class="cta-wrapper">
                <a href="${typeof window !== 'undefined' ? window.location.origin : ''}/invest/dashboard" class="cta-btn">Access Vault Portal</a>
              </div>

              <hr class="divider" />

              <!-- Security Notice -->
              <div class="security-notice">
                <p>
                  ⚠ SECURITY NOTICE — SpaceX will never request your full account number via email. 
                  If you did not initiate this request, contact our secure line immediately. 
                  All transmissions are logged and monitored.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-brand">© 2025 SpaceX Corp. // All Rights Reserved</div>
              <div class="footer-links">
                <a href="#">Privacy</a> &nbsp;·&nbsp; <a href="#">Security</a> &nbsp;·&nbsp; <a href="#">Unsubscribe</a>
              </div>
            </div>
            <div class="bottom-bar"></div>
          </div>
        </body>
        </html>
      `;
      break;

    case 'withdrawal_code':
      subject = 'SECURITY PROTOCOL: Authorization Code Required';
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #000; font-family: 'Rajdhani', sans-serif; }
            .wrapper { max-width: 600px; margin: 0 auto; background: #000; border: 1px solid #1e3a8a; position: relative; overflow: hidden; }
            .top-bar { height: 4px; background: #ef4444; }
            .header { padding: 40px; border-bottom: 1px solid #1e3a8a; }
            .brand { font-family: 'Share Tech Mono', monospace; color: #ef4444; font-size: 12px; letter-spacing: 5px; margin-bottom: 10px; }
            .title { color: #fff; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
            .body { padding: 40px; }
            .message { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
            .code-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 30px; text-align: center; margin-bottom: 30px; }
            .code-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: #ef4444; letter-spacing: 3px; margin-bottom: 15px; text-transform: uppercase; }
            .code-value { font-family: 'Share Tech Mono', monospace; font-size: 36px; color: #fff; letter-spacing: 12px; font-weight: 700; }
            .warning { background: rgba(59, 130, 246, 0.05); padding: 20px; border-left: 2px solid #3b82f6; margin-top: 30px; }
            .warning p { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #60a5fa; line-height: 1.5; }
            .footer { padding: 30px 40px; border-top: 1px solid #1e3a8a; text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #334155; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="top-bar"></div>
            <div class="header">
              <div class="brand">SECURITY COMMAND // ALPHA V</div>
              <h1 class="title">Withdrawal Authorization</h1>
            </div>
            <div class="body">
              <p class="message">
                A withdrawal request was initiated from your SpaceX Asset Vault. 
                Please enter the following one-time security code to authorize this transaction. 
                This code will expire in 10 minutes.
              </p>
              <div class="code-box">
                <div class="code-label">One-Time Security Code</div>
                <div class="code-value">${securityHash}</div>
              </div>
              <div class="warning">
                <p>
                  // SYSTEM WARNING: If you did not initiate this request, your account may be compromised. 
                  Login immediately and change your security credentials.
                </p>
              </div>
            </div>
            <div class="footer">
              © 2025 SPACEX FINANCIAL SERVICES // END OF TRANSMISSION
            </div>
          </div>
        </body>
        </html>
      `;
      break;
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html })
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to send ${type} email:`, error);
    return { success: false, error };
  }
}
