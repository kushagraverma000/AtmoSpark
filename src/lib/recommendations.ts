export function getInsights(temp: number, humidity: number) {
  let alerts: string[] = [];
  let actions: string[] = [];

  if (temp > 35) {
    alerts.push("High heat between 1 PM – 5 PM");
    actions.push("Avoid outdoor exposure during peak hours");
    actions.push("Stay hydrated — drink water every 30 minutes");
  }

  if (humidity > 70) {
    alerts.push("High humidity discomfort");
    actions.push("Limit strenuous physical activity");
  }

  return { alerts, actions };
}