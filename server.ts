import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Resend lazily to handle missing key gracefully
  let resend: Resend | null = null;
  const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not set. Email functionality will be simulated.");
      return null;
    }
    if (!resend) resend = new Resend(key);
    return resend;
  };

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;
    const resendClient = getResend();

    console.log(`[Email] Sending to ${to}: ${subject}`);

    if (resendClient) {
      try {
        const { data, error } = await resendClient.emails.send({
          from: "SpaceX Verification <noreply@resend.dev>",
          to: [to],
          subject,
          html,
        });

        if (error) {
          return res.status(400).json({ error });
        }
        return res.json({ success: true, data });
      } catch (err) {
        return res.status(500).json({ error: "Failed to send email" });
      }
    } else {
      // Simulation mode
      console.log("SIMULATION: Email sent to", to);
      return res.json({ success: true, simulated: true });
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
