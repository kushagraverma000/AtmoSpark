import LocationCard from "@/components/LocationCard";
import { SectionLabel } from "@/components/SectionLabel";
import ClimateRiskScore from "@/components/ClimateRiskScore";
import RiskBreakdown from "@/components/RiskBreakdown";
import AlertsSection from "@/components/AlertsSection";
import RecommendedActions from "@/components/RecommendedActions";
import FutureOutlook from "@/components/FutureOutlook";
import ChatPanel from "@/components/ChatPanel";

import { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { getWeather, getForecastOutlook, type OutlookDay } from "@/lib/getWeather";
import { calculateRisk, windMsToKmh } from "@/lib/riskEngine";
import { getInsights } from "@/lib/recommendations";
import { validateCityQuery } from "@/lib/citySearch";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Radio, Search, AlertCircle } from "lucide-react";

const Index = () => {
  const [temp, setTemp] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windKmh, setWindKmh] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [outlookDays, setOutlookDays] = useState<OutlookDay[]>([]);
  const [city, setCity] = useState("Ghaziabad");
  const [displayCity, setDisplayCity] = useState("Ghaziabad");
  const [searchInput, setSearchInput] = useState("Ghaziabad");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);
  /** When true, `fetchError` came from the weather API (vs client validation). */
  const [errorFromApi, setErrorFromApi] = useState(false);
  const [hasValidWeather, setHasValidWeather] = useState(false);

  const lastGoodDisplayRef = useRef("Ghaziabad");

  const runSearch = () => {
    const v = validateCityQuery(searchInput);
    if (v.ok === false) {
      setErrorFromApi(false);
      setFetchError(v.message);
      return;
    }
    setFetchError(null);
    setErrorFromApi(false);
    setCity(v.query);
  };

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    setErrorFromApi(false);

    getWeather(city).then(async (result) => {
      if (result.ok === false) {
        setErrorFromApi(true);
        setFetchError(result.message);
        setSearchInput(lastGoodDisplayRef.current);
        setLoading(false);
        return;
      }

      const { data } = result;
      const resolved = data.name;
      lastGoodDisplayRef.current = resolved;
      setDisplayCity(resolved);
      setSearchInput(resolved);

      const tempVal = data.main.temp;
      const humidityVal = data.main.humidity;
      const feels = data.main.feels_like;
      const windVal = windMsToKmh(data.wind.speed);

      setTemp(tempVal);
      setFeelsLike(feels);
      setHumidity(humidityVal);
      setWindKmh(windVal);

      const score = calculateRisk(tempVal, humidityVal);
      setRiskScore(score);

      const insight = getInsights(tempVal, humidityVal);
      setAlerts(insight.alerts);
      setActions(insight.actions);

      const outlook = await getForecastOutlook(data.coord.lat, data.coord.lon, data.timezone);
      setOutlookDays(outlook ?? []);

      setHasValidWeather(true);
      setLoading(false);
    });
  }, [city]);

  useEffect(() => {
    if (!loading && hasValidWeather) {
      setLastUpdated(new Date());
    }
  }, [loading, city, hasValidWeather]);

  const riskTintClass =
    riskScore > 70
      ? "dashboard-risk-tint-high"
      : riskScore > 40
        ? "dashboard-risk-tint-medium"
        : "dashboard-risk-tint-low";

  return (
    <div
      className={cn(
        "min-h-screen dashboard-page-bg",
        !loading && hasValidWeather && riskTintClass,
      )}
    >
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="rounded-2xl border border-border/60 bg-card/75 backdrop-blur-md shadow-card px-4 py-4 sm:px-6 sm:py-4 mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <div className="flex items-center gap-2.5 text-base min-w-0">
            <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden />
            <span className="text-muted-foreground shrink-0">Using</span>
            <span className="font-display font-semibold text-foreground truncate">
              {hasValidWeather ? displayCity : "—"}
            </span>
          </div>
          <span className="hidden sm:block h-4 w-px bg-border shrink-0" aria-hidden />
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-risk-low">
            <Radio className="w-4 h-4" strokeWidth={2.5} aria-hidden />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low ring-2 ring-risk-low/25" />
            </span>
            Live data
          </div>
          <div className="sm:ml-auto text-sm text-muted-foreground tabular-nums">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Refreshing…
              </span>
            ) : hasValidWeather ? (
              <span title={lastUpdated.toISOString()}>
                Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </span>
            ) : (
              <span>Waiting for a valid location</span>
            )}
          </div>
        </div>

        <div className="mb-5 sm:mb-6">
          <label htmlFor="city-search" className="sr-only">
            Search city
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-3xl">
            <input
              id="city-search"
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setFetchError(null);
                setErrorFromApi(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  runSearch();
                }
              }}
              placeholder="City name or City, Country code (e.g. London, UK)…"
              className={cn(
                "flex-1 min-w-0 rounded-xl border bg-card/90 backdrop-blur-sm px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200 hover:border-border focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40",
                fetchError
                  ? errorFromApi && hasValidWeather
                    ? "border-amber-500/40"
                    : "border-destructive/50"
                  : "border-border/80",
              )}
            />
            <button
              type="button"
              onClick={runSearch}
              disabled={loading || !searchInput.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/15 transition-all hover:opacity-95 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 sm:shrink-0"
            >
              <Search className="h-4 w-4" aria-hidden />
              Search
            </button>
          </div>
          {fetchError && (
            <p
              className={cn(
                "mt-2 flex items-start gap-2 text-base",
                errorFromApi && hasValidWeather
                  ? "text-amber-800 dark:text-amber-200/95"
                  : "text-destructive",
              )}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
              <span>
                {errorFromApi && hasValidWeather ? (
                  <>
                    <span className="font-medium">Previous location kept.</span> {fetchError} Data below is still for{" "}
                    <span className="font-semibold">{displayCity}</span>.
                  </>
                ) : (
                  fetchError
                )}
              </span>
            </p>
          )}
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Only locations OpenWeather recognizes return data — gibberish or unknown places are rejected with no fake
            numbers.
            {hasValidWeather && (
              <>
                {" "}
                The assistant uses live readings for{" "}
                <span className="font-medium text-foreground">{displayCity}</span>.
              </>
            )}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-5 py-16 text-center"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 mb-4">
                <span className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-base font-semibold text-foreground">Loading climate context</p>
              <p className="text-sm text-muted-foreground mt-2">Fetching conditions for {city}…</p>
            </motion.div>
          ) : !hasValidWeather ? (
            <motion.div
              key="no-data"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-border/70 bg-card/80 px-6 py-14 text-center max-w-lg mx-auto"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">No weather data yet</p>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Search for a real city (see the note under the search box). Unknown places are rejected — we never show
                placeholder weather.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 xl:gap-8"
            >
              <aside className="xl:col-span-3 space-y-4 lg:space-y-5 order-2 xl:order-none">
                <SectionLabel>Live conditions</SectionLabel>
                <div className="space-y-4 lg:space-y-5 xl:sticky xl:top-28 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1 xl:-mr-1 [scrollbar-gutter:stable]">
                  <LocationCard
                    temp={temp}
                    feelsLike={feelsLike}
                    humidity={humidity}
                    windKmh={windKmh}
                    city={displayCity}
                  />
                  <RiskBreakdown temp={temp} humidity={humidity} feelsLike={feelsLike} />
                  <RecommendedActions actions={actions} />
                </div>
              </aside>

              <section className="xl:col-span-6 order-1 xl:order-none min-w-0">
                <SectionLabel>Ask AtmoSpark</SectionLabel>
                <ChatPanel
                  temp={temp}
                  humidity={humidity}
                  city={displayCity}
                  feelsLike={feelsLike}
                  windKmh={windKmh}
                  riskScore={riskScore}
                  riskLevel={riskScore > 70 ? "high" : riskScore > 40 ? "medium" : "low"}
                  alerts={alerts}
                />
              </section>

              <aside className="xl:col-span-3 space-y-4 lg:space-y-5 order-3 xl:order-none">
                <SectionLabel>Risk & alerts</SectionLabel>
                <div className="space-y-4 lg:space-y-5 xl:sticky xl:top-28 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1 xl:-mr-1 [scrollbar-gutter:stable]">
                  <ClimateRiskScore score={riskScore} variant="default" />
                  <AlertsSection alerts={alerts} />
                  <FutureOutlook days={outlookDays} />
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
