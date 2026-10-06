import { useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  { id: 'p1', name: 'Teclado mecánico', price: 89.9, stock: 12 },
  { id: 'p2', name: 'Mouse inalámbrico', price: 45.5, stock: 30 },
  { id: 'p3', name: 'Monitor 24"', price: 650, stock: 5 },
];

let nextId = initialProducts.length + 1;

function makeId(): string {
  const id = `p${nextId}`;
  nextId += 1;
  return id;
}

type FormState = {
  name: string;
  price: string;
  stock: string;
};

const emptyForm: FormState = { name: '', price: '', stock: '' };

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleAgregar() {
    const trimmedName = form.name.trim();
    const parsedPrice = Number(form.price);
    const parsedStock = Number(form.stock);

    const name = trimmedName || `Producto nuevo ${nextId}`;
    const price = Number.isFinite(parsedPrice) && form.price.trim() !== '' ? parsedPrice : 0;
    const stock = Number.isFinite(parsedStock) && form.stock.trim() !== '' ? parsedStock : 0;

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, name, price, stock } : p))
      );
      setStatus(`Producto actualizado: ${name}`);
    } else {
      const newProduct: Product = { id: makeId(), name, price, stock };
      setProducts((prev) => [...prev, newProduct]);
      setStatus(`Producto agregado: ${name}`);
    }
    resetForm();
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), stock: String(p.stock) });
    setStatus(`Editando producto: ${p.name}`);
  }

  function handleCancelEdit() {
    resetForm();
    setStatus('Edición cancelada');
  }

  function handleDeleteRequest(id: string) {
    setConfirmDeleteId(id);
  }

  function handleConfirmDelete(p: Product) {
    setProducts((prev) => prev.filter((item) => item.id !== p.id));
    setConfirmDeleteId(null);
    setStatus(`Producto eliminado: ${p.name}`);
    if (editingId === p.id) resetForm();
  }

  function handleCancelDelete() {
    setConfirmDeleteId(null);
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Mantenimiento de productos</h1>
        <p className="subtitle">Alta, listado, edición, búsqueda y eliminación (datos en memoria)</p>
      </header>

      <section className="panel" aria-labelledby="form-title">
        <h2 id="form-title">{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Teclado mecánico"
            />
          </div>
          <div className="field">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div className="field">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              placeholder="0"
            />
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={handleAgregar}>
            {editingId ? 'Guardar cambios' : 'Agregar'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancelar edición
            </button>
          )}
        </div>
      </section>

      <section className="panel" aria-labelledby="search-title">
        <h2 id="search-title">Búsqueda</h2>
        <div className="field">
          <label htmlFor="search">Buscar por nombre</label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe para filtrar..."
          />
        </div>
      </section>

      <section className="panel" aria-labelledby="list-title">
        <h2 id="list-title">Listado de productos ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <p className="empty-state">No hay productos que coincidan con la búsqueda.</p>
        ) : (
          <ul className="product-list">
            {filtered.map((p) => (
              <li key={p.id} className="product-card">
                <div className="product-info">
                  <span className="product-name">{p.name}</span>
                  <span className="product-meta">
                    Precio: ${p.price.toFixed(2)} · Stock: {p.stock}
                  </span>
                </div>
                <div className="product-actions">
                  <button type="button" className="btn btn-small" onClick={() => handleEdit(p)}>
                    Editar
                  </button>
                  {confirmDeleteId === p.id ? (
                    <span className="confirm-delete">
                      <span>¿Eliminar?</span>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => handleConfirmDelete(p)}
                      >
                        Sí
                      </button>
                      <button type="button" className="btn btn-small" onClick={handleCancelDelete}>
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteRequest(p.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p role="status" aria-live="polite" className="status-region">
        {status}
      </p>
    </main>
  );
}
