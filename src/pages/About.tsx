import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, LineChart, Users } from "lucide-react";

const About = () => (
  <div className="min-h-[calc(100vh-5rem)] dashboard-page-bg">
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          About AtmoSpark
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
          We built AtmoSpark for anyone who needs quick, honest answers when heat, humidity, or daily conditions affect
          safety and planning — workers, families, and communities included.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-12 space-y-10 max-w-3xl"
      >
        <section className="rounded-2xl border border-border/70 bg-card/90 p-6 sm:p-8 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">What you see is real data</h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Current weather drives the dashboard. Invalid locations don’t silently fall back to fake numbers — we’d
                rather show an error than mislead you. Risk scores and breakdowns are computed from the same live
                readings you see in the location card.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/90 p-6 sm:p-8 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Built for decisions</h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                The assistant is the center of the experience: ask about outdoor work, travel, kids, or heat stress. It
                uses your selected city’s temperature and humidity so answers stay relevant to where you are.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/90 p-6 sm:p-8 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-risk-low-bg flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-risk-low" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Not a substitute for official warnings</h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                AtmoSpark helps you think through day-to-day choices. Always follow local government alerts, medical
                advice, and emergency services when conditions are severe.
              </p>
            </div>
          </div>
        </section>
      </motion.div>

      <p className="mt-12 text-base text-muted-foreground">
        <Link to="/dashboard" className="font-semibold text-primary hover:underline">
          Go to the dashboard
        </Link>{" "}
        or{" "}
        <Link to="/" className="font-semibold text-primary hover:underline">
          return home
        </Link>
        .
      </p>
    </div>
  </div>
);

export default About;
