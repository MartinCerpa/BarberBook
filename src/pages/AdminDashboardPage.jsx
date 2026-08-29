import DashboardCard from '../components/admin/DashboardCard'
import { dashboard } from '../data/dashboard'
import { formatCurrency } from '../utils/formatters'

function AdminDashboardPage({ pendingRequests }) {
  return (
    <div className="admin-page dashboard-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Resumen de hoy</p>
          <h1>Tu jornada</h1>
        </div>
      </header>

      <section className="dashboard-grid" aria-label="Indicadores de hoy">
        <DashboardCard
          label="Solicitudes"
          value={pendingRequests}
          detail="solicitudes por revisar"
          tone="accent"
          href="#/panel/requests"
        />
        <DashboardCard
          label="Próxima atención"
          value={dashboard.nextClient.time}
          detail={`${dashboard.nextClient.name} · ${dashboard.nextClient.service}`}
          tone="dark"
          href="#/panel/schedule"
        />
        <DashboardCard
          label="Clientes del día"
          value={dashboard.clientsToday}
          detail="clientes agendados"
        />
        <DashboardCard
          label="Ingresos estimados"
          value={formatCurrency(dashboard.estimatedIncome)}
          detail="Según reservas confirmadas"
        />
      </section>

      <section className="dashboard-focus">
        <div>
          <p className="eyebrow">Agenda de hoy</p>
          <h2>{dashboard.reservationsToday} atenciones</h2>
          <p>
            {dashboard.completedAppointments} completadas ·{' '}
            {dashboard.reservationsToday - dashboard.completedAppointments} por atender
          </p>
        </div>
        <div className="dashboard-focus__aside">
          <a href="#/panel/schedule">Abrir agenda <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
