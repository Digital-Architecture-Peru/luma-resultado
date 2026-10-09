import type { Severity } from '../../api/types';
import { SEVERITY_LABELS } from '../../model/notifications';
import { Icon } from './Icon';

/** La severidad se comunica con icono y texto, no solo con color. */
export function Badge({ severity }: { severity: Severity }) {
  return (
    <span className={`badge badge--${severity.toLowerCase()}`}>
      <Icon severity={severity} />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
