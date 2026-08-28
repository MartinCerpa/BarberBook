import ScheduleItem from '../components/admin/ScheduleItem'
import { schedule } from '../data/schedule'

function SchedulePage() {
  return (
    <div className="admin-page schedule-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Vista diaria</p>
          <h1>Agenda</h1>
          <p>
            Una lectura simple de la jornada, sin convertir todavía el panel en
            un calendario complejo.
          </p>
        </div>
        <div className="schedule-date">
          <span>Hoy</span>
          <strong>{schedule.dateLabel}</strong>
        </div>
      </header>

      <section className="schedule-summary" aria-label="Resumen de agenda">
        <div>
          <strong>{schedule.confirmedCount}</strong>
          <span>Reservas confirmadas</span>
        </div>
        <div>
          <strong>{schedule.availableCount}</strong>
          <span>Espacios disponibles</span>
        </div>
        <p>Las solicitudes pendientes no aparecen aquí hasta ser aceptadas.</p>
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
