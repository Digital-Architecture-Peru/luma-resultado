import { NotificacionesList } from '../components/organisms/NotificacionesList';
import { PreferenciasPanel } from '../components/organisms/PreferenciasPanel';
import { PaginaLayout } from '../components/templates/PaginaLayout';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { usePreferencias } from '../hooks/usePreferencias';
import type { NotificacionesApi } from '../services/notificacionesApi';

interface Props {
  api: NotificacionesApi;
  cuentaId: string;
}

export function NotificacionesPage({ api, cuentaId }: Props) {
  const notificaciones = useNotificaciones(api, cuentaId);
  const preferencias = usePreferencias(api, cuentaId);
  const sinLeer = notificaciones.items.filter((n) => !n.leida).length;

  return (
    <PaginaLayout titulo="Centro de notificaciones">
      <section aria-labelledby="titulo-lista" className="panel">
        <h2 id="titulo-lista">Movimientos y alertas</h2>
        <p>Sin leer: {sinLeer}</p>
        <label className="filtro">
          <input
            type="checkbox"
            checked={notificaciones.soloNoLeidas}
            onChange={(e) => notificaciones.setSoloNoLeidas(e.target.checked)}
          />
          Solo no leídas
        </label>
        {notificaciones.errorAccion && <p role="alert">{notificaciones.errorAccion}</p>}
        <NotificacionesList
          estado={notificaciones.estado}
          items={notificaciones.items}
          error={notificaciones.error}
          onMarcarLeida={notificaciones.marcarLeida}
        />
      </section>
      <PreferenciasPanel
        estado={preferencias.estado}
        preferencias={preferencias.preferencias}
        error={preferencias.error}
        onGuardar={preferencias.guardar}
      />
    </PaginaLayout>
  );
}
