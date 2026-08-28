import DashboardCard from '../components/admin/DashboardCard'
import { dashboard } from '../data/dashboard'
import { formatCurrency } from '../utils/formatters'

function AdminDashboardPage({ pendingRequests }) {
  return (
    <div className="admin-page dashboard-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Resumen de hoy</p>
          <h1>{dashboard.greeting}</h1>
          <p>{dashboard.introduction}</p>
        </div>
        <a className="button button--primary" href="#/panel/requests">
          Revisar solicitudes
        </a>
      </header>

      <section className="dashboard-grid" aria-label="Indicadores de hoy">
        <DashboardCard
          label="Solicitudes pendientes"
          value={pendingRequests}
          detail="Esperan tu decisión"
          tone="accent"
        />
        <DashboardCard
          label="Reservas hoy"
          value={dashboard.reservationsToday}
          detail={`${dashboard.completedAppointments} atenciones completadas`}
        />
        <DashboardCard
          label="Ingresos estimados"
          value={formatCurrency(dashboard.estimatedIncome)}
          detail="Según reservas confirmadas"
        />
        <DashboardCard
          label="Próximo cliente"
          value={dashboard.nextClient.time}
          detail={`${dashboard.nextClient.name} · ${dashboard.nextClient.service}`}
          tone="dark"
        />
      </section>

      <section className="dashboard-focus">
        <div>
          <p className="eyebrow">Siguiente paso</p>
          <h2>Tu agenda está bajo control</h2>
          <p>
            Las solicitudes nuevas permanecen pendientes hasta que las revises.
            Ninguna hora se confirma automáticamente.
          </p>
        </div>
        <dl>
          <div>
            <dt>Próxima atención</dt>
            <dd>{dashboard.nextClient.time}</dd>
          </div>
          <div>
            <dt>Cliente</dt>
            <dd>{dashboard.nextClient.name}</dd>
          </div>
          <div>
            <dt>Servicio</dt>
            <dd>{dashboard.nextClient.service}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default AdminDashboardPage
