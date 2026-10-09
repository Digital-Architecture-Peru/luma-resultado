import type { Severity } from '../../api/types';

const PATHS: Record<Severity, string> = {
  Info: 'M12 8h.01M11 12h1v5h1',
  Warning: 'M12 9v4M12 17h.01M10.3 4l-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0z',
  Critical: 'M12 8v5M12 16h.01M8 3h8l5 5v8l-5 5H8l-5-5V8z',
};

export function Icon({ severity }: { severity: Severity }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[severity]} />
    </svg>
  );
}
