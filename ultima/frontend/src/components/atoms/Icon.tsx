import type { IconName } from "../../domain/notificationMeta";

const PATHS: Record<IconName, string> = {
  cart: "M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L19 8H6.2M9 19.5a1 1 0 1 0 0 .01M17 19.5a1 1 0 1 0 0 .01",
  calendar: "M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4",
  lock: "M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l4-5",
};

interface IconProps {
  name: IconName;
}

/** Átomo: icono SVG decorativo (oculto para lectores de pantalla). */
export function Icon({ name }: IconProps) {
  return (
    <svg
      className="icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
