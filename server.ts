import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize Resend lazily
  let resend: Resend | null = null;
  const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is missing. Email dispatch is in simulation mode.");
      return null;
    }
    if (!resend) resend = new Resend(key);
    return resend;
  };

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;
    const resendClient = getResend();

    console.log(`[Server] Attempting to send email to: ${to}`);

    if (resendClient) {
      try {
        // Validation: Ensure required fields are present
        if (!to || !subject || !html) {
          const missing = [];
          if (!to) missing.push("recipient");
          if (!subject) missing.push("subject");
          if (!html) missing.push("content");
          
          console.error("[Resend Error] Missing mandatory fields:", missing.join(", "));
          return res.status(400).json({ 
            success: false, 
            error: { name: "local_validation_error", message: `Missing mandatory fields: ${missing.join(", ")}` } 
          });
        }

        const { data, error } = await resendClient.emails.send({
          from: "SpaceX Vault <onboarding@resend.dev>",
          to: Array.isArray(to) ? to : [to], // Force array to be safe
          subject: String(subject),
          html: String(html),
        });

        if (error) {
          console.error("[Resend Error Detail]", JSON.stringify(error, null, 2));
          return res.status(400).json({ success: false, error });
        }
        
        console.log("[Resend Success]", data);
        return res.json({ success: true, data });
      } catch (err: any) {
        console.error("[Server Error]", err);
        return res.status(500).json({ success: false, error: err.message });
      }
    } else {
      console.log(`[SIMULATION] Email to ${to} ("${subject}") simulated successfully.`);
      return res.json({ 
        success: true, 
        simulated: true,
        message: "Email simulated. To send real emails, please provide a RESEND_API_KEY in the settings." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
