import ScheduleItem from '../components/admin/ScheduleItem'
import { schedule } from '../data/schedule'

function SchedulePage() {
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
          <span>Atenciones confirmadas</span>
        </div>
        <div>
          <strong>{schedule.availableCount}</strong>
          <span>Horarios abiertos</span>
        </div>
        <p>Los horarios bloqueados y disponibles se distinguen de inmediato.</p>
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
