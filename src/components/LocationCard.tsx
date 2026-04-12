import { MapPin, Droplets, Wind } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  temp: number;
  feelsLike: number;
  humidity: number;
  windKmh: number;
  city: string;
}

function fmtDeg(n: number): string {
  const v = Math.round(n * 10) / 10;
  return Number.isInteger(v) ? `${v}` : v.toFixed(1);
}

function fmtWind(n: number): string {
  const v = Math.round(n * 10) / 10;
  return Number.isInteger(v) ? `${v}` : v.toFixed(1);
}

const LocationCard = ({ temp, feelsLike, humidity, windKmh, city }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card-dashboard-interactive p-5 sm:p-6 overflow-hidden"
  >
    <div className="flex items-start gap-3 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
        <MapPin className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">Current conditions</p>
        <p className="text-xl sm:text-2xl font-display font-semibold text-foreground tracking-tight mt-1 break-words">
          {city}
        </p>
      </div>
    </div>

    <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-center min-w-0">
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">Feels like</p>
      <p className="text-xl sm:text-2xl font-display font-bold text-foreground tabular-nums mt-1">{fmtDeg(feelsLike)}°C</p>
    </div>

    <ul className="mt-4 space-y-2.5 min-w-0">
      <li className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/35 px-4 py-3 min-w-0">
        <span className="text-xs sm:text-sm font-semibold text-muted-foreground shrink-0 flex items-center gap-1.5">
          <span className="text-base" aria-hidden>
            🌡
          </span>
          Temp
        </span>
        <span className="text-lg sm:text-xl font-display font-bold text-foreground tabular-nums text-right truncate min-w-0">
          {fmtDeg(temp)}°C
        </span>
      </li>
      <li className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/35 px-4 py-3 min-w-0">
        <span className="text-xs sm:text-sm font-semibold text-muted-foreground shrink-0 flex items-center gap-1.5">
          <Droplets className="w-4 h-4 opacity-75" aria-hidden />
          Humidity
        </span>
        <span className="text-lg sm:text-xl font-display font-bold text-foreground tabular-nums text-right truncate min-w-0">
          {humidity}%
        </span>
      </li>
      <li className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/35 px-4 py-3 min-w-0">
        <span className="text-xs sm:text-sm font-semibold text-muted-foreground shrink-0 flex items-center gap-1.5">
          <Wind className="w-4 h-4 opacity-75" aria-hidden />
          Wind
        </span>
        <span className="text-right min-w-0">
          <span className="text-lg sm:text-xl font-display font-bold text-foreground tabular-nums block truncate">
            {fmtWind(windKmh)}
          </span>
          <span className="text-xs text-muted-foreground">km/h</span>
        </span>
      </li>
    </ul>
  </motion.div>
);

export default LocationCard;
