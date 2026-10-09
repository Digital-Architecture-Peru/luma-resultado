import { formatFecha } from "../../utils/format";

interface FechaProps {
  iso: string;
  locale: string;
}

export function Fecha({ iso, locale }: FechaProps) {
  return <time dateTime={iso}>{formatFecha(iso, locale)}</time>;
}
