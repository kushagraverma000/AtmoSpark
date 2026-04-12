import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center dashboard-page-bg px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Error 404</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-foreground">Page not found</h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          That URL doesn’t exist. Use the navigation above or head back to a known page.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-md"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-base font-semibold text-foreground"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
