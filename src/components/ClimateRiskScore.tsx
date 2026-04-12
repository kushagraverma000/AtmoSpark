import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  /** `hero` = large focal card; `default` = sidebar / rail layout */
  variant?: "default" | "hero";
}

const ClimateRiskScore = ({ score, variant = "default" }: Props) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const level = score > 70 ? "high" : score > 40 ? "medium" : "low";

  const label =
    level === "high" ? "High Risk" : level === "medium" ? "Medium Risk" : "Low Risk";

  const strokeClass =
    level === "high"
      ? "stroke-risk-high"
      : level === "medium"
        ? "stroke-risk-medium"
        : "stroke-risk-low";

  const glowClass =
    level === "high" ? "shadow-glow-high" : level === "medium" ? "shadow-glow-medium" : "shadow-glow-low";

  const badgeClass =
    level === "high"
      ? "bg-risk-high-bg text-risk-high border-risk-high/15"
      : level === "medium"
        ? "bg-risk-medium-bg text-risk-medium border-risk-medium/15"
        : "bg-risk-low-bg text-risk-low border-risk-low/15";

  const isHero = variant === "hero";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className={cn(
        "card-dashboard-interactive flex flex-col items-center relative overflow-hidden ring-1 ring-border/40",
        isHero ? "p-8 sm:p-10" : "p-5 sm:p-5",
        isHero ? glowClass : undefined,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-[0.55] pointer-events-none",
          level === "high" && "bg-gradient-to-br from-risk-high-bg/80 via-transparent to-transparent",
          level === "medium" && "bg-gradient-to-br from-risk-medium-bg/80 via-transparent to-transparent",
          level === "low" && "bg-gradient-to-br from-risk-low-bg/80 via-transparent to-transparent",
        )}
      />

      <div className="relative z-[1] flex flex-col items-center w-full">
        <p
          className={cn(
            "font-medium text-muted-foreground tracking-wide uppercase",
            isHero ? "text-xs mb-5" : "text-base font-semibold mb-4",
          )}
        >
          Climate risk score
        </p>

        <div className={cn("relative", isHero ? "w-44 h-44 sm:w-48 sm:h-48" : "w-36 h-36")}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-muted/80" />

            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={strokeClass}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={cn(
                "font-display font-bold text-foreground tabular-nums leading-none tracking-tight",
                isHero ? "text-5xl sm:text-6xl" : "text-4xl sm:text-[2.5rem]",
              )}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 22 }}
            >
              {score}
            </motion.span>
            <span className="text-muted-foreground mt-1 text-sm">/ 100</span>
          </div>
        </div>

        <div
          className={cn(
            "mt-5 px-4 py-2 rounded-full border font-semibold tracking-tight text-sm sm:text-base",
            badgeClass,
          )}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default ClimateRiskScore;
