import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getGeminiResponse } from "@/lib/gemini";

interface Message {
  role: "user" | "ai";
  text: string;
}

const initialMessages: Message[] = [
  {
    role: "ai",
    text: "Hello — I’m AtmoSpark. I use your dashboard’s live weather (temperature, humidity, wind, risk score) to help you decide what’s reasonable to do today. Ask me anything about outdoor work, travel, kids, heat, or comfort.",
  },
];

export interface ChatPanelProps {
  temp?: number;
  humidity?: number;
  city?: string;
  feelsLike?: number;
  windKmh?: number;
  riskScore?: number;
  riskLevel?: "low" | "medium" | "high";
  alerts?: string[];
}

const ChatPanel = ({
  temp = 0,
  humidity = 0,
  city = "Ghaziabad",
  feelsLike = 0,
  windKmh = 0,
  riskScore = 0,
  riskLevel = "low",
  alerts = [],
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const context = {
      city,
      temp,
      humidity,
      feelsLike,
      windKmh,
      riskScore,
      riskLevel,
      alerts: [...alerts],
    };

    let aiText: string;

    try {
      const { text, error } = await getGeminiResponse(userMessage, context);

      if (text) {
        aiText = text;
      } else {
        const tip = getSmartOfflineTip(userMessage, context);
        aiText = error
          ? `I couldn’t reach the AI service (${error}). Here’s a quick read using only your live dashboard numbers (${city}: ${fmt(temp)}°C air, ${fmt(feelsLike)}°C feels-like, ${humidity}% humidity, ${fmt(windKmh)} km/h wind, risk ${riskScore}/100 — ${riskLevel}):\n\n${tip}`
          : tip;
      }
    } catch {
      aiText = getSmartOfflineTip(userMessage, context);
    }

    setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full min-h-[min(560px,calc(100vh-15rem))] xl:min-h-[calc(100vh-13rem)] max-h-[min(720px,calc(100vh-11rem))] xl:max-h-[calc(100vh-10rem)] rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md shadow-elevated ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden"
    >
      <header className="shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-b border-border/60 bg-gradient-to-br from-primary/[0.08] via-card to-risk-low-bg/[0.12]">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Sparkles className="w-5 h-5 sm:h-6 sm:w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
              Climate decision assistant
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5 leading-relaxed">
              Live context: <span className="font-medium text-foreground">{city}</span>
              <span className="text-muted-foreground/80"> · </span>
              {fmt(temp)}°C (feels {fmt(feelsLike)}°C) · {humidity}% RH · {fmt(windKmh)} km/h · risk {riskScore}/100 (
              {riskLevel})
            </p>
            {alerts.length > 0 && (
              <p className="text-xs sm:text-sm text-risk-high font-medium mt-1.5 leading-snug">
                Alerts: {alerts.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.06),transparent)]"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[min(100%,560px)] px-4 py-3.5 rounded-2xl text-base leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md shadow-md shadow-primary/15"
                  : "bg-muted/60 text-foreground rounded-bl-md border border-border/50 shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl rounded-bl-md border border-border/50 bg-muted/40 px-4 py-3.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" />
                </span>
                AtmoSpark is thinking…
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="shrink-0 p-4 sm:p-5 border-t border-border/60 bg-gradient-to-t from-muted/30 to-card/98 backdrop-blur-sm">
        <div className="flex gap-2 sm:gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask what’s safe to do — work outside, travel, kids, pets, heat…"
            className="flex-1 min-w-0 rounded-xl border border-border/70 bg-background/80 px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/80 shadow-inner outline-none transition-shadow focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="shrink-0 inline-flex h-[46px] w-[46px] sm:h-[48px] sm:w-[48px] items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

function fmt(n: number): string {
  const v = Math.round(n * 10) / 10;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

type TipCtx = ChatPanelProps & { alerts: string[] };

function getSmartOfflineTip(question: string, ctx: TipCtx): string {
  const q = question.toLowerCase();
  const { temp, humidity, feelsLike, windKmh, city, riskScore, alerts } = ctx;
  const heatStress = feelsLike >= temp + 3 || temp >= 33;
  const alertLine = alerts.length ? ` Dashboard alerts: ${alerts.join("; ")}.` : "";

  if (q.includes("work") || q.includes("farm") || q.includes("outside") || q.includes("exercise")) {
    if (temp > 35 || heatStress) {
      return `Heat is elevated (${temp}°C, feels like ${fmt(feelsLike)}°C in ${city}). Avoid strenuous outdoor work 11am–4pm if you can; shift to early morning or evening, take breaks in shade, and drink water regularly.${alertLine}`;
    }
    if (temp > 30) {
      return `Conditions in ${city} are warm (${temp}°C, ${humidity}% humidity). Outdoor work is possible but schedule harder tasks for cooler hours and hydrate often.${alertLine}`;
    }
    return `Conditions look relatively mild (${temp}°C). You can work outside; still take breaks and water, especially if ${humidity}% humidity feels sticky.${alertLine}`;
  }

  if (q.includes("flood") || q.includes("rain")) {
    return `Rain and flood risk aren’t in your live snapshot — follow local forecasts and avoid flooded roads. Current readings: ${temp}°C, ${humidity}% humidity in ${city}.`;
  }

  if (q.includes("safe") || q.includes("today")) {
    if (riskScore > 70 || temp > 35) {
      return `Risk is on the high side (score ${riskScore}/100, ${temp}°C). Reduce prolonged outdoor exposure during the hottest part of the day and prioritize hydration and shade.${alertLine}`;
    }
    if (riskScore > 40) {
      return `Moderate risk (${riskScore}/100) with ${temp}°C and ${humidity}% humidity — generally okay for normal activity with breaks and water.${alertLine}`;
    }
    return `Risk looks lower (${riskScore}/100) for ${city} at ${temp}°C — still stay aware and adapt if you feel unwell.${alertLine}`;
  }

  if (q.includes("children") || q.includes("elderly") || q.includes("kids")) {
    return `For vulnerable groups in ${city}: at ${temp}°C and ${fmt(feelsLike)}°C feels-like, limit midday sun, keep them hydrated, and watch for overheating. Seek medical help for confusion, vomiting, or fainting.${alertLine}`;
  }

  if (q.includes("travel") || q.includes("go out") || q.includes("drive")) {
    return `For travel in ${city}: ${temp}°C, wind ${fmt(windKmh)} km/h. Carry water, avoid leaving people or pets in a closed vehicle, and plan around peak heat if possible.${alertLine}`;
  }

  if (q.includes("pet") || q.includes("dog")) {
    return `Pets: at ${temp}°C (${fmt(feelsLike)}°C feels-like), shorten walks in peak heat, provide water, and avoid hot pavement. ${windKmh < 5 ? "Air is fairly still — heat can feel worse." : "Some wind may help a bit with comfort."}${alertLine}`;
  }

  if (q.includes("heat") || q.includes("hot") || q.includes("humid")) {
    return `Right now in ${city}: ${temp}°C air, ${fmt(feelsLike)}°C feels-like, ${humidity}% humidity. ${heatStress ? "Heat stress is plausible — pace activity and hydrate." : "Heat stress is less extreme but still hydrate and take breaks."} Wind ${fmt(windKmh)} km/h.${alertLine}`;
  }

  return `Using your live data for ${city}: ${temp}°C (feels ${fmt(feelsLike)}°C), ${humidity}% humidity, ${fmt(windKmh)} km/h wind, risk score ${riskScore}/100. Ask about outdoor work, travel, exercise, or who’s most at risk — I’ll focus on that.${alertLine}`;
}

export default ChatPanel;
