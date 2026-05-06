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
    // Check multiple possible environment variable names
    const key = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || process.env.RESEND_KEY;
    
    if (!key) {
      const availableKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('resend') || k.toLowerCase().includes('api'));
      console.warn(`[Resend Protocol] API Key not found. Detected related env keys: ${availableKeys.join(', ')}`);
      return null;
    }
    
    console.info("[Resend Protocol] API Key detected. Initializing live dispatch.");
    if (!resend) resend = new Resend(key);
    return resend;
  };

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;
    const resendClient = getResend();

    console.log(`[Server] Request received for: ${to}`);

    if (resendClient) {
      try {
        if (!to || !subject || !html) {
          return res.status(400).json({ 
            success: false, 
            error: { message: "Missing mandatory fields (to, subject, or html)." } 
          });
        }

        const { data, error } = await resendClient.emails.send({
          from: "SpaceX Vault <onboarding@resend.dev>",
          to: Array.isArray(to) ? to : [to],
          subject: String(subject),
          html: String(html),
        });

        if (error) {
          console.error("[Resend Error] API call rejected:", error);
          return res.status(400).json({ success: false, error });
        }
        
        return res.json({ success: true, data });
      } catch (err: any) {
        console.error("[Server Error] Exception during dispatch:", err);
        return res.status(500).json({ success: false, error: { message: err.message || "Internal server error" } });
      }
    } else {
      console.log(`[SIMULATION] Responding with simulation data for ${to}`);
      return res.json({ 
        success: true, 
        simulated: true,
        message: "SIMULATION MODE: RESEND_API_KEY not found in environment. Please add it to your project settings to enable live emails." 
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
