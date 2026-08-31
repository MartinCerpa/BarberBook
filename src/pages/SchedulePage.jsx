import { useEffect, useState } from 'react'
import ScheduleItem from '../components/admin/ScheduleItem'
import { requestContext } from '../data/requests'
import {
  blockTimeSlot,
  enableTimeSlot,
  getAvailabilityRequestsForDate,
  getBookingDates,
  getEffectiveTimeSlotsForDate,
  restoreTimeSlot,
  subscribeAvailability,
  unblockTimeSlot,
} from '../services/availabilityService.js'
import { formatRequestDateId } from '../utils/requestUtils'

const availabilityActions = {
  block: blockTimeSlot,
  unblock: unblockTimeSlot,
  enable: enableTimeSlot,
  restore: restoreTimeSlot,
}

function SchedulePage({ requests, onViewRequests }) {
  const [, refreshAvailability] = useState(0)
  useEffect(() => subscribeAvailability(() => refreshAvailability((value) => value + 1)), [])
  const bookingDates = getBookingDates(undefined, requests)
  const [selectedDateId, setSelectedDateId] = useState(
    () => bookingDates[0]?.id ?? '',
  )
  const [availabilityFeedback, setAvailabilityFeedback] = useState(null)
  const referenceDateId = bookingDates[0]?.id
  const dateLabel = selectedDateId ? formatRequestDateId(selectedDateId) : ''
  const dayRequests = getAvailabilityRequestsForDate(selectedDateId, requests)
  const timelineItems = selectedDateId
    ? getEffectiveTimeSlotsForDate(selectedDateId, dayRequests)
    : []
  const isCompleted = (item) =>
    selectedDateId < referenceDateId ||
    (selectedDateId === referenceDateId && item.time <= requestContext.currentTime)
  const confirmedItems = timelineItems.filter((item) => item.status === 'confirmed')
  const completedCount = confirmedItems.filter(isCompleted).length
  const pendingAttentionCount = confirmedItems.length - completedCount
  const nextAppointment = confirmedItems.find((item) => !isCompleted(item))

  const updateAvailability = (slot) => {
    const result = availabilityActions[slot.action]?.(selectedDateId, slot.time, dayRequests)

    if (!result?.success) {
      setAvailabilityFeedback({
        type: 'error',
        message: 'No pudimos actualizar este horario en el navegador.',
      })
      return
    }

    setAvailabilityFeedback({
      type: 'success',
      message: {
        block: `${slot.time} quedó bloqueada para esta fecha.`,
        unblock: `Bloqueo de ${slot.time} retirado para esta fecha.`,
        enable: `${slot.time} habilitada solo para esta fecha.`,
        restore: `${slot.time} vuelve a seguir el horario habitual.`,
      }[slot.action],
    })
  }

  return (
    <div className="admin-page schedule-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Jornada profesional</p>
          <h1>Agenda</h1>
          <p>
            Revisa atenciones, espacios disponibles y bloqueos con una lectura
            rápida de toda la jornada.
          </p>
        </div>
        <div className="schedule-date">
          <span>Vista del día</span>
          <strong>{dateLabel}</strong>
        </div>
      </header>

      <section className="schedule-summary" aria-label="Resumen de agenda">
        <div>
          <strong>{confirmedItems.length}</strong>
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

      <section
        className="schedule-availability"
        aria-labelledby="schedule-availability-title"
      >
        <header className="schedule-availability__heading">
          <div>
            <p className="eyebrow">Disponibilidad para reservas</p>
            <h2 id="schedule-availability-title">Gestiona horas</h2>
          </div>
        </header>

        <div
          className="schedule-date-options"
          role="group"
          aria-label="Seleccionar día de agenda"
        >
          {bookingDates.map((date) => (
            <button
              type="button"
              aria-pressed={selectedDateId === date.id}
              aria-label={`${formatRequestDateId(date.id)}${date.available ? '' : ', sin horas disponibles'}`}
              data-day-off={!date.available || undefined}
              onClick={() => {
                setSelectedDateId(date.id)
                setAvailabilityFeedback(null)
              }}
              key={date.id}
            >
              <span>{date.label}</span>
              <strong>{date.dayNumber}</strong>
              <small>{date.month}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="schedule-list" aria-label={`Agenda del ${dateLabel}`}>
        {timelineItems.map((item) => (
          <ScheduleItem
            item={{ ...item, isNext: item.id === nextAppointment?.id }}
            dateLabel={dateLabel}
            onAvailabilityAction={() => updateAvailability(item)}
            onViewRequests={() =>
              onViewRequests({
                dateId: selectedDateId,
                time: item.time,
                referenceDateId,
              })
            }
            key={item.id}
          />
        ))}
      </section>
      <div className="schedule-availability__feedback" aria-live="polite">
        {availabilityFeedback ? (
          <p data-type={availabilityFeedback.type}>
            {availabilityFeedback.message}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default SchedulePage
