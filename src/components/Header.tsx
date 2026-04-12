import { Zap } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-primary/12 text-primary"
      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
  );

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-border/80 bg-card/85 backdrop-blur-xl shadow-[0_1px_0_hsl(var(--border)/0.45)]">
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
      <NavLink to="/" className="flex items-center gap-3 min-w-0 shrink-0 group md:max-w-[min(100%,14rem)]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/85 flex items-center justify-center shadow-md shadow-primary/20 ring-1 ring-primary/20 group-hover:ring-primary/35 transition-shadow">
          <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 text-left">
          <p className="text-lg sm:text-xl font-display font-bold text-foreground leading-tight tracking-tight">
            AtmoSpark
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-snug truncate">
            Climate decision intelligence
          </p>
        </div>
      </NavLink>

      <nav
        className="flex flex-wrap items-center gap-1 border-t border-border/50 pt-3 md:border-0 md:pt-0 md:flex-1 md:justify-center md:gap-1"
        aria-label="Main"
      >
        <NavLink to="/" className={navClass} end>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
      </nav>

      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <span
          className="inline-flex items-center rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground"
          title="Operational status"
        >
          Live systems
        </span>
        <span className="relative flex h-2.5 w-2.5" title="Systems operational">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low/40 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-risk-low ring-2 ring-background" />
        </span>
      </div>
    </div>
  </header>
);

export default Header;
