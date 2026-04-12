import { Shield, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  actions: string[];
}

const RecommendedActions = ({ actions }: Props) => {
  const empty = actions.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card-dashboard-interactive p-5 sm:p-6"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-foreground/80 mb-4">Recommended actions</p>

      {empty ? (
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 rounded-xl border border-dashed border-border/80 bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mb-3 ring-1 ring-primary/15">
            <ClipboardList className="w-6 h-6 text-primary" strokeWidth={1.75} />
          </div>
          <p className="text-base font-semibold text-foreground">No extra steps right now</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-[260px] leading-relaxed">
            No recommended actions for current conditions — you’re in a good range. Check back after weather
            updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/25 border border-border/60 hover:border-border transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="text-base text-foreground leading-relaxed pt-0.5">{action}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecommendedActions;
