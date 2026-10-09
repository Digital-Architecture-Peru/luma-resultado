interface PagerProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

/** Molécula: paginación anterior/siguiente (página base 0 hacia afuera, base 1 en pantalla). */
export function Pager({ page, pageSize, total, onChange }: PagerProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className="pager" aria-label="Paginación de notificaciones">
      <button type="button" className="button button--secondary" disabled={page <= 0} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span className="pager__info">
        Página {page + 1} de {totalPages}
      </span>
      <button
        type="button"
        className="button button--secondary"
        disabled={page + 1 >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
