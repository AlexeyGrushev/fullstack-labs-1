import type { ReactNode } from "react";
import "./FadeIn.css";

export function FadeIn({ children }: { children: ReactNode }) {
  return <div className="fade-in">{children}</div>;
}
