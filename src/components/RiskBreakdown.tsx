import { motion } from "framer-motion";
import {
  heatStressPercent,
  humidityStressPercent,
  feelsLikeGapPercent,
} from "@/lib/riskEngine";

interface Props {
  temp: number;
  humidity: number;
  feelsLike: number;
}

function barColor(value: number, mode: "heat" | "humid" | "feel"): string {
  if (mode === "feel") {
    if (value < 25) return "bg-risk-low";
    if (value < 55) return "bg-risk-medium";
    return "bg-risk-high";
  }
  if (value < 35) return "bg-risk-low";
  if (value < 65) return "bg-risk-medium";
  return "bg-risk-high";
}

const RiskBreakdown = ({ temp, humidity, feelsLike }: Props) => {
  const heat = heatStressPercent(temp);
  const humid = humidityStressPercent(humidity);
  const feelGap = feelsLikeGapPercent(temp, feelsLike);

  const rows = [
    {
      label: "Heat stress",
      hint: "From measured air temperature",
      value: heat,
      color: barColor(heat, "heat"),
    },
    {
      label: "Humidity load",
      hint: "From relative humidity",
      value: humid,
      color: barColor(humid, "humid"),
    },
    {
      label: "Feels-like gap",
      hint: "How much it feels vs the thermometer (API)",
      value: feelGap,
      color: barColor(feelGap, "feel"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card-dashboard-interactive p-5 sm:p-6"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-foreground/80 mb-1">
        Risk breakdown
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-snug">
        Derived from live OpenWeather fields (temp, humidity, feels-like).
      </p>

      <div className="space-y-5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between items-baseline gap-2 mb-0.5">
              <div className="min-w-0">
                <span className="text-base font-semibold text-foreground">{r.label}</span>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{r.hint}</p>
              </div>
              <span className="text-base font-display font-bold tabular-nums text-muted-foreground shrink-0">
                {r.value}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-muted/80 overflow-hidden ring-1 ring-border/40 mt-2">
              <motion.div
                className={`h-full rounded-full ${r.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${r.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskBreakdown;
