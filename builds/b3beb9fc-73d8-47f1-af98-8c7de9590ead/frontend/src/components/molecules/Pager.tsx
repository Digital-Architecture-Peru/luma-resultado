interface PagerProps {
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pager({ page, size, total, onPageChange }: PagerProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / size));
  return (
    <nav className="pager" aria-label="Paginación">
      <button type="button" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        Anterior
      </button>
      <span>
        Página {page + 1} de {totalPaginas}
      </span>
      <button type="button" disabled={page + 1 >= totalPaginas} onClick={() => onPageChange(page + 1)}>
        Siguiente
      </button>
    </nav>
  );
}
