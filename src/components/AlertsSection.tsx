import { AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  alerts: string[];
}

const AlertsSection = ({ alerts }: Props) => {
  const empty = alerts.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="card-dashboard-interactive p-5 sm:p-6"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-foreground/80 mb-4">Active alerts</p>

      {empty ? (
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 rounded-xl border border-dashed border-border/80 bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-risk-low-bg flex items-center justify-center mb-3 ring-1 ring-risk-low/15">
            <ShieldCheck className="w-6 h-6 text-risk-low" strokeWidth={1.75} />
          </div>
          <p className="text-base font-semibold text-foreground">No active alerts</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-[240px] leading-relaxed">
            Conditions are stable for your selected area. We’ll surface warnings here if risk increases.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 rounded-xl border bg-risk-high-bg/90 border-risk-high/20 text-risk-high shadow-sm transition-colors hover:border-risk-high/35"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-base font-medium leading-snug">{alert}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AlertsSection;
