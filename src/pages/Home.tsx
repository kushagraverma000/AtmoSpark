import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CloudSun, MessageCircle, Shield } from "lucide-react";

const Home = () => (
  <div className="min-h-[calc(100vh-5rem)] dashboard-page-bg">
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-3xl"
      >
        <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.14em] text-primary mb-4">
          Climate decision intelligence
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.08]">
          Decide with confidence when the weather turns risky.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
          AtmoSpark combines live conditions, a clear risk view, and an assistant that answers practical questions — so
          you know what’s safe today, not just what the thermometer says.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 active:scale-[0.99]"
          >
            Open dashboard
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-card/80 px-6 py-3.5 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted/50"
          >
            How it works
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
      >
        {[
          {
            icon: CloudSun,
            title: "Live conditions",
            body: "Temperature, humidity, and wind from trusted weather data — no placeholder numbers.",
          },
          {
            icon: Shield,
            title: "Risk you can read",
            body: "A single score plus breakdown so heat, humidity, and comfort gaps are easy to interpret.",
          },
          {
            icon: MessageCircle,
            title: "Assistant-first",
            body: "Ask what’s safe for work, travel, or family — grounded in the city you selected.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border/70 bg-card/90 backdrop-blur-sm p-6 sm:p-7 shadow-card"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default Home;
