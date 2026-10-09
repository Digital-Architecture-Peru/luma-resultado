interface BadgeProps {
  tone: 'ok' | 'warn';
  label: string;
}

export function Badge({ tone, label }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}
