import { Button } from '../atoms/Button';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className="pagination" aria-label="Paginación">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </Button>
      <span>
        Página {page} de {totalPages}
      </span>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente
      </Button>
    </nav>
  );
}
