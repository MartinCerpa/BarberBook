import { useMemo, useState } from 'react'
import ScheduleItem from '../components/admin/ScheduleItem'
import { schedule } from '../data/schedule'
import {
  blockTimeSlot,
  getBookingDates,
  getEffectiveTimeSlotsForDate,
  unblockTimeSlot,
} from '../services/availabilityService.js'

const availabilityStatus = {
  available: {
    label: 'Libre',
    description: 'Disponible para nuevas solicitudes',
  },
  pending: {
    label: 'Con solicitudes',
    description: 'Sigue disponible según la regla actual',
  },
  confirmed: {
    label: 'Ocupada',
    description: 'Existe una reserva confirmada',
  },
  blocked: {
    label: 'No disponible',
    description: 'Horario no disponible en la agenda base',
  },
}

const formatDateLabel = (dateId) =>
  new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${dateId}T12:00:00`))

function SchedulePage() {
  const bookingDates = useMemo(() => getBookingDates(), [])
  const [selectedDateId, setSelectedDateId] = useState(
    () => bookingDates.find((date) => date.available)?.id ?? '',
  )
  const [availabilityFeedback, setAvailabilityFeedback] = useState(null)
  const nextAppointmentIndex = schedule.items.findIndex((item) => item.isNext)
  const completedCount = schedule.items.filter(
    (item, itemIndex) =>
      item.status === 'confirmed' &&
      nextAppointmentIndex >= 0 &&
      itemIndex < nextAppointmentIndex,
  ).length
  const pendingAttentionCount = schedule.confirmedCount - completedCount
  const selectedDate = bookingDates.find((date) => date.id === selectedDateId)
  const availabilitySlots = selectedDateId
    ? getEffectiveTimeSlotsForDate(selectedDateId)
    : []

  const updateManualBlock = (slot) => {
    const result = slot.isManualBlock
      ? unblockTimeSlot(selectedDateId, slot.time)
      : blockTimeSlot(selectedDateId, slot.time)

    if (!result.success) {
      setAvailabilityFeedback({
        type: 'error',
        message: 'No pudimos actualizar este horario en el navegador.',
      })
      return
    }

    setAvailabilityFeedback({
      type: 'success',
      message: slot.isManualBlock
        ? `${slot.time} vuelve a estar disponible.`
        : `${slot.time} quedó bloqueada para esta fecha.`,
    })
  }

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

      <section
        className="schedule-availability"
        aria-labelledby="schedule-availability-title"
      >
        <header className="schedule-availability__heading">
          <div>
            <p className="eyebrow">Disponibilidad para reservas</p>
            <h2 id="schedule-availability-title">Gestiona horas</h2>
          </div>
          <strong>{selectedDateId ? formatDateLabel(selectedDateId) : ''}</strong>
        </header>

        <div
          className="schedule-date-options"
          role="group"
          aria-label="Seleccionar fecha de disponibilidad"
        >
          {bookingDates.map((date) => (
            <button
              type="button"
              aria-pressed={selectedDateId === date.id}
              disabled={!date.available}
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

        <div
          className="schedule-availability__slots"
          aria-label={`Disponibilidad para ${selectedDate ? formatDateLabel(selectedDate.id) : 'la fecha seleccionada'}`}
        >
          {availabilitySlots.map((slot) => {
            const presentation = slot.isManualBlock
              ? {
                  label: 'Bloqueada',
                  description: 'Bloqueo manual del profesional',
                }
              : availabilityStatus[slot.status]
            const canBlock = slot.status === 'available'
            const canUnblock = slot.isManualBlock

            return (
              <article
                className={`schedule-availability-slot schedule-availability-slot--${slot.status}${slot.isManualBlock ? ' is-manual-block' : ''}`}
                key={slot.time}
              >
                <time>{slot.time}</time>
                <div>
                  <strong>{presentation.label}</strong>
                  <span>{presentation.description}</span>
                </div>
                {canBlock || canUnblock ? (
                  <button
                    type="button"
                    onClick={() => updateManualBlock(slot)}
                    aria-label={`${canUnblock ? 'Desbloquear' : 'Bloquear'} ${slot.time} del ${formatDateLabel(selectedDateId)}`}
                  >
                    {canUnblock ? 'Desbloquear' : 'Bloquear'}
                  </button>
                ) : (
                  <span className="schedule-availability-slot__fixed">
                    Sin acciones
                  </span>
                )}
              </article>
            )
          })}
        </div>

        <div className="schedule-availability__feedback" aria-live="polite">
          {availabilityFeedback ? (
            <p data-type={availabilityFeedback.type}>
              {availabilityFeedback.message}
            </p>
          ) : null}
        </div>
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
