/**
 * API server: holds OpenWeather + Gemini keys (never shipped in the Vite bundle).
 * Dev: run alongside Vite; Vite proxies /api → this server.
 * Prod: `NODE_ENV=production node server/index.js` serves `dist/` + /api.
 */
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, ".env") });

/** Google AI Studio keys are often mis-read due to spaces, CRLF, or extra quotes in .env */
function normalizeApiKey(raw) {
  if (raw == null) return "";
  let s = String(raw).replace(/^\uFEFF/, "").replace(/\r/g, "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

const app = express();
const PORT = Number(process.env.PORT || 8787);
const isProd = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "120kb" }));

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.get("/api/weather/current", async (req, res) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return res.status(500).json({
      cod: 500,
      message: "Server is not configured with OPENWEATHER_API_KEY.",
    });
  }
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    return res.status(400).json({ cod: 400, message: "Missing city query (q)." });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${key}&units=metric`;
    const r = await fetch(url);
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch {
    return res.status(502).json({ cod: 502, message: "Could not reach weather service." });
  }
});

app.get("/api/weather/forecast", async (req, res) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return res.status(500).json({
      cod: 500,
      message: "Server is not configured with OPENWEATHER_API_KEY.",
    });
  }
  const { lat, lon } = req.query;
  if (lat == null || lon == null || String(lat) === "" || String(lon) === "") {
    return res.status(400).json({ cod: 400, message: "Missing lat or lon." });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&appid=${key}&units=metric`;
    const r = await fetch(url);
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch {
    return res.status(502).json({ cod: 502, message: "Could not reach forecast service." });
  }
});

const ATMOSPARK_SYSTEM = `You are **AtmoSpark**, a climate and weather **decision assistant** (not a generic chatbot).

Your job:
- Help people decide what is **safer or smarter to do today** given **heat, humidity, comfort, and risk** — e.g. outdoor work, exercise, travel, kids/elderly care, pets, hydration, and when to seek shade or rest.
- **Always ground** your advice in the **live weather snapshot** the user’s dashboard supplies (temperature, feels-like, humidity, wind, risk score, alerts). Reference those numbers naturally when they matter.
- Be **practical and specific**: concrete do / don’t / when / how long, not vague platitudes.
- If the question is **not** about weather, health comfort, or safety decisions, answer very briefly and **steer back** to how you can help with climate-informed choices.
- You **must not invent** current weather numbers. If critical data is missing, say you need the dashboard to show updated conditions.
- For **medical emergencies or severe weather**, tell the user to follow **official alerts** and **emergency services**; you give general decision support only.
- Tone: clear, calm, supportive. You may use short paragraphs or bullet points when it helps readability.`;

function buildUserTurn({ question, context }) {
  const city = context?.city && typeof context.city === "string" ? context.city : "Unknown location";
  const temp = typeof context?.temp === "number" ? context.temp : null;
  const feelsLike = typeof context?.feelsLike === "number" ? context.feelsLike : null;
  const humidity = typeof context?.humidity === "number" ? context.humidity : null;
  const windKmh = typeof context?.windKmh === "number" ? context.windKmh : null;
  const riskScore = typeof context?.riskScore === "number" ? context.riskScore : null;
  const riskLevel =
    context?.riskLevel === "low" || context?.riskLevel === "medium" || context?.riskLevel === "high"
      ? context.riskLevel
      : null;
  const alerts = Array.isArray(context?.alerts)
    ? context.alerts.filter((a) => typeof a === "string" && a.trim())
    : [];

  const lines = [
    "## Live snapshot from the user’s AtmoSpark dashboard",
    "",
    `- **Location:** ${city}`,
    temp !== null ? `- **Air temperature:** ${temp}°C` : "- **Air temperature:** (not provided)",
    feelsLike !== null ? `- **Feels like:** ${feelsLike}°C` : "- **Feels like:** (not provided)",
    humidity !== null ? `- **Relative humidity:** ${humidity}%` : "- **Relative humidity:** (not provided)",
    windKmh !== null ? `- **Wind:** ${windKmh} km/h` : "- **Wind:** (not provided)",
    riskScore !== null && riskLevel
      ? `- **Composite climate risk score:** ${riskScore}/100 (${riskLevel})`
      : riskScore !== null
        ? `- **Composite climate risk score:** ${riskScore}/100`
        : "- **Composite climate risk score:** (not provided)",
    alerts.length
      ? `- **Active dashboard alerts:** ${alerts.map((a) => a.trim()).join(" · ")}`
      : "- **Active dashboard alerts:** none",
    "",
    "## User question",
    "",
    question.trim(),
    "",
    "## What to do",
    "",
    "Answer as AtmoSpark. Tie recommendations to the snapshot when the question is about safety, comfort, or planning. If numbers are missing, say so and still give general principles.",
  ];

  return lines.join("\n");
}

app.post("/api/chat/gemini", async (req, res) => {
  const apiKey = normalizeApiKey(
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  );
  if (!apiKey) {
    return res.status(503).json({
      text: null,
      error: "Server is not configured with GEMINI_API_KEY (or GOOGLE_API_KEY).",
    });
  }

  const model = (process.env.GEMINI_MODEL || "gemini-2.0-flash").trim();
  const { question, context } = req.body ?? {};

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ text: null, error: "Missing question." });
  }

  if (question.length > 8000) {
    return res.status(400).json({ text: null, error: "Question is too long." });
  }

  const userText = buildUserTurn({ question, context });

  const body = {
    systemInstruction: {
      parts: [{ text: ATMOSPARK_SYSTEM }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userText }],
      },
    ],
    generationConfig: {
      temperature: 0.65,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  try {
    // Use x-goog-api-key header (recommended). Query ?key= can break with special chars or proxies.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (!r.ok) {
      const msg =
        data?.error?.message ||
        (typeof data?.error === "string" ? data.error : null) ||
        (typeof data?.message === "string" ? data.message : null) ||
        "Gemini request failed.";
      return res.status(r.status >= 400 ? r.status : 502).json({ text: null, error: msg });
    }

    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
      return res.json({
        text: null,
        error: `Prompt was blocked (${blockReason}). Try rephrasing your question.`,
      });
    }

    const candidate = data?.candidates?.[0];
    const finish = candidate?.finishReason;
    const text = candidate?.content?.parts?.map((p) => p?.text).filter(Boolean).join("\n") ?? null;

    if (text && text.trim()) {
      return res.json({ text: text.trim(), error: null });
    }

    if (finish && finish !== "STOP" && finish !== "MAX_TOKENS") {
      return res.json({
        text: null,
        error: `Model stopped (${finish}). Try a shorter or simpler question.`,
      });
    }

    return res.json({
      text: null,
      error: "The model returned no text. Check GEMINI_MODEL and API key, or try again.",
    });
  } catch (e) {
    console.error("Gemini proxy error:", e);
    return res.status(502).json({ text: null, error: "Could not reach Gemini." });
  }
});

if (isProd) {
  const dist = path.join(root, "dist");
  app.use(express.static(dist));
  app.use((req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(dist, "index.html"));
  });
}

app.listen(PORT, () => {
  if (isProd) {
    console.log(`Production app + API at http://localhost:${PORT}`);
  } else {
    console.log(`API server at http://localhost:${PORT} (Vite proxies /api here in dev)`);
  }
  if (!normalizeApiKey(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
    console.warn("[AtmoSpark] Set GEMINI_API_KEY or GOOGLE_API_KEY in .env for the AI assistant.");
  }
  if (!process.env.OPENWEATHER_API_KEY?.trim()) {
    console.warn("[AtmoSpark] Set OPENWEATHER_API_KEY in .env for weather data.");
  }
});
