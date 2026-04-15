import { apiUrl } from "@/lib/api";

type GeminiContext = {
  city?: string;
  temp?: number;
  humidity?: number;
  feelsLike?: number;
  windKmh?: number;
  riskScore?: number;
  riskLevel?: "low" | "medium" | "high";
  alerts?: string[];
};

type GeminiResponse = {
  text: string | null;
  error: string | null;
};

export async function getGeminiResponse(
  prompt: string,
  context: GeminiContext,
): Promise<GeminiResponse> {
  try {
    const res = await fetch(apiUrl("/api/chat/gemini"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: prompt,
        context,
      }),
    });

    const data = (await res.json()) as Partial<GeminiResponse>;

    return {
      text: typeof data.text === "string" ? data.text : null,
      error: typeof data.error === "string" ? data.error : null,
    };
  } catch (err) {
    console.log(err);
    return { text: null, error: "Network error. Check the backend URL and try again." };
  }
}
