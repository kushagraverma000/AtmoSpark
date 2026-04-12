export async function getGeminiResponse(prompt: string, context: any) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
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