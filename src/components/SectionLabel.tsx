import type { ReactNode } from "react";

/** Section heading above dashboard columns — larger and higher contrast than body UI labels. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sm sm:text-base font-bold uppercase tracking-[0.1em] text-foreground/85 mb-3 pl-3 border-l-[3px] border-primary/55">
      {children}
    </h2>
  );
}
