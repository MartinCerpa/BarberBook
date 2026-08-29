import ScheduleItem from '../components/admin/ScheduleItem'
import { schedule } from '../data/schedule'

function SchedulePage() {
  const nextAppointmentIndex = schedule.items.findIndex((item) => item.isNext)
  const completedCount = schedule.items.filter(
    (item, itemIndex) =>
      item.status === 'confirmed' &&
      nextAppointmentIndex >= 0 &&
      itemIndex < nextAppointmentIndex,
  ).length
  const pendingAttentionCount = schedule.confirmedCount - completedCount

  return (
    <div className="admin-page schedule-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Jornada de hoy</p>
          <h1>Agenda</h1>
          <p>
            Revisa atenciones, espacios disponibles y bloqueos con una lectura
            rápida de toda la jornada.
          </p>
        </div>
        <div className="schedule-date">
          <span>Vista del día</span>
          <strong>{schedule.dateLabel}</strong>
        </div>
      </header>

      <section className="schedule-summary" aria-label="Resumen de agenda">
        <div>
          <strong>{schedule.confirmedCount}</strong>
          <span>Total de atenciones</span>
        </div>
        <div>
          <strong>{completedCount}</strong>
          <span>Completadas</span>
        </div>
        <a
          className="schedule-summary__link"
          href="#/panel/requests"
          aria-label={`Ver ${pendingAttentionCount} solicitudes pendientes`}
        >
          <strong>{pendingAttentionCount}</strong>
          <span>Pendientes</span>
          <span className="schedule-summary__link-action" aria-hidden="true">
            Ver →
          </span>
        </a>
      </section>

      <section className="schedule-list" aria-label={`Agenda del ${schedule.dateLabel}`}>
        {schedule.items.map((item) => (
          <ScheduleItem item={item} key={item.id} />
        ))}
      </section>
    </div>
  )
}

export default SchedulePage
