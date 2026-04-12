// export type AtmoSparkChatContext = {
//   city: string;
//   temp: number;
//   humidity: number;
//   /** °C — heat stress vs air temp */
//   feelsLike: number;
//   /** km/h */
//   windKmh: number;
//   /** 0–100 composite score from dashboard */
//   riskScore: number;
//   /** low | medium | high */
//   riskLevel: "low" | "medium" | "high";
//   /** Active alert strings from dashboard, if any */
//   alerts: string[];
// };

// export type GeminiCallResult = {
//   text: string | null;
//   /** Present when the model did not return usable text */
//   error?: string;
// };

// /**
//  * Calls `/api/chat/gemini` — API key stays on the server.
//  */
// export async function getGeminiResponse(
//   question: string,
//   context: AtmoSparkChatContext,
// ): Promise<GeminiCallResult> {
//   try {
//     const res = await fetch("/api/chat/gemini", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ question, context }),
//     });

//     const data = (await res.json()) as {
//       text?: string | null;
//       error?: string | null;
//     };

//     if (!res.ok) {
//       let msg = data?.error?.trim() || `Request failed (${res.status})`;
//       if (/api key/i.test(msg)) {
//         msg += " — Check project root `.env`: `GEMINI_API_KEY=...` (no spaces), then restart `npm run dev`. In Google Cloud → Credentials, set key restrictions to “None” for local testing.";
//       }
//       return { text: null, error: msg };
//     }

//     const text = typeof data.text === "string" && data.text.trim() ? data.text.trim() : null;
//     if (text) return { text };

//     const err = data?.error?.trim();
//     return {
//       text: null,
//       error: err || "The model returned an empty answer. Try rephrasing your question.",
//     };
//   } catch (e) {
//     console.error("Gemini client error:", e);
//     return { text: null, error: "Network error while contacting the assistant." };
//   }
// }


export async function getGeminiResponse(prompt: string, context: any) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_OPENROUTER_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `User question: ${prompt}
Temperature: ${context.temp}
Humidity: ${context.humidity}
City: ${context.city}`
          }
        ]
      })
    });

    const data = await res.json();

    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}