import DashboardCard from '../components/admin/DashboardCard'
import { dashboard } from '../data/dashboard'
import { formatCurrency } from '../utils/formatters'

function AdminDashboardPage({ pendingRequests }) {
  return (
    <div className="admin-page dashboard-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Resumen profesional</p>
          <h1>{dashboard.greeting}</h1>
          <p>{dashboard.introduction}</p>
        </div>
        <a className="button button--primary" href="#/panel/requests">
          Gestionar solicitudes
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
          label="Próxima atención"
          value={dashboard.nextClient.time}
          detail={`${dashboard.nextClient.name} · ${dashboard.nextClient.service}`}
          tone="dark"
        />
        <DashboardCard
          label="Clientes del día"
          value={dashboard.clientsToday}
          detail={`${dashboard.completedAppointments} atenciones completadas`}
        />
        <DashboardCard
          label="Ingresos estimados"
          value={formatCurrency(dashboard.estimatedIncome)}
          detail="Según reservas confirmadas"
        />
      </section>

      <section className="dashboard-focus">
        <div>
          <p className="eyebrow">Próxima atención</p>
          <h2>{dashboard.nextClient.time} · {dashboard.nextClient.name}</h2>
          <p>
            {dashboard.nextClient.service}. Revisa la jornada completa o resuelve
            primero las solicitudes que todavía esperan una decisión.
          </p>
        </div>
        <div className="dashboard-focus__aside">
          <dl>
            <div>
              <dt>Atenciones de hoy</dt>
              <dd>{dashboard.reservationsToday}</dd>
            </div>
            <div>
              <dt>Completadas</dt>
              <dd>{dashboard.completedAppointments}</dd>
            </div>
            <div>
              <dt>Pendientes</dt>
              <dd>{pendingRequests}</dd>
            </div>
          </dl>
          <a href="#/panel/schedule">Abrir agenda completa <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
