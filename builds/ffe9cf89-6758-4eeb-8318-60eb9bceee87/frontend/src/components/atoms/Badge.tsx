import type { ReactNode } from 'react';

interface BadgeProps {
  tone?: 'neutral' | 'info' | 'success' | 'danger';
  children: ReactNode;
}

export default function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
