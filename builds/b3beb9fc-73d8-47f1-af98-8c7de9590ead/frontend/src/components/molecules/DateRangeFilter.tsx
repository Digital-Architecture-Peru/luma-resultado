interface DateRangeFilterProps {
  desde: string;
  hasta: string;
  onChange: (campo: 'desde' | 'hasta', valor: string) => void;
}

export function DateRangeFilter({ desde, hasta, onChange }: DateRangeFilterProps) {
  return (
    <>
      <div className="field">
        <label htmlFor="filtro-desde">Desde</label>
        <input
          id="filtro-desde"
          type="date"
          value={desde}
          max={hasta || undefined}
          onChange={(e) => onChange('desde', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="filtro-hasta">Hasta</label>
        <input
          id="filtro-hasta"
          type="date"
          value={hasta}
          min={desde || undefined}
          onChange={(e) => onChange('hasta', e.target.value)}
        />
      </div>
    </>
  );
}
