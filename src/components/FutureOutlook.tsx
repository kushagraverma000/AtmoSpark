import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { OutlookDay } from "@/lib/getWeather";

interface Props {
  days: OutlookDay[];
}

const FutureOutlook = ({ days }: Props) => {
  const hasData = days.length > 0;
  const first = days[0]?.risk ?? 0;
  const last = days[days.length - 1]?.risk ?? first;
  const trend =
    last > first + 5 ? "increase" : last < first - 5 ? "decrease" : "stay near current levels";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="card-dashboard-interactive p-5 sm:p-6"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center ring-1 ring-border/50">
          <TrendingUp className="w-4 h-4 text-foreground/80" />
        </div>
        <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">Future outlook</p>
      </div>

      {!hasData ? (
        <p className="text-base text-muted-foreground leading-relaxed py-4 text-center px-1">
          Forecast data isn’t available right now. Risk scores above still reflect current conditions.
        </p>
      ) : (
        <>
          <p className="text-base text-foreground mb-5 leading-relaxed">
            Based on the 5-day forecast, composite risk is likely to{" "}
            <span
              className={`font-semibold ${
                trend === "increase"
                  ? "text-risk-high"
                  : trend === "decrease"
                    ? "text-risk-low"
                    : "text-foreground"
              }`}
            >
              {trend === "increase" ? "rise" : trend === "decrease" ? "ease" : "hold steady"}
            </span>{" "}
            over the next few days (daily averages from OpenWeather).
          </p>
          <div className="flex items-end gap-2 sm:gap-3 h-28 px-1">
            {days.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="w-full h-24 flex flex-col justify-end rounded-lg bg-muted/40 ring-1 ring-border/50 overflow-hidden p-1">
                  <motion.div
                    className={`w-full rounded-md bg-gradient-to-t ${
                      d.risk > 70
                        ? "from-risk-high to-risk-high/75"
                        : d.risk > 40
                          ? "from-risk-medium to-risk-medium/80"
                          : "from-risk-low to-risk-low/80"
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${d.risk}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-semibold truncate w-full text-center">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FutureOutlook;
