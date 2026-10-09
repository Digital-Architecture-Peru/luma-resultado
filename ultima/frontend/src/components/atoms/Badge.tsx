import type { ReactNode } from "react";
import type { Tone } from "../../domain/notificationMeta";

interface BadgeProps {
  tone: Tone;
  children: ReactNode;
}

/** Átomo: etiqueta corta. El significado va en el texto, no solo en el color. */
export function Badge({ tone, children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
