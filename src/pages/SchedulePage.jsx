import { useMemo, useState } from 'react'
import ScheduleItem from '../components/admin/ScheduleItem'
import { getScheduleAppointmentsForDate } from '../data/schedule'
import { requestContext } from '../data/requests'
import {
  blockTimeSlot,
  getBookingDates,
  getEffectiveTimeSlotsForDate,
  unblockTimeSlot,
} from '../services/availabilityService.js'
import {
  formatRequestDateId,
  getRequestDateId,
  isHistoricalRequest,
} from '../utils/requestUtils'

function SchedulePage({ requests, onViewRequests }) {
  const bookingDates = useMemo(() => getBookingDates(), [])
  const [selectedDateId, setSelectedDateId] = useState(
    () => bookingDates[0]?.id ?? '',
  )
  const [availabilityFeedback, setAvailabilityFeedback] = useState(null)
  const selectedDate = bookingDates.find((date) => date.id === selectedDateId)
  const referenceDateId = bookingDates[0]?.id
  const dateLabel = selectedDateId ? formatRequestDateId(selectedDateId) : ''
  const dayRequests = requests.filter(
    (request) =>
      getRequestDateId(request, referenceDateId, requestContext) === selectedDateId &&
      (request.status === 'confirmed' ||
        (request.status === 'pending' && !isHistoricalRequest(request, requestContext))),
  )
  const availabilitySlots = selectedDateId
    ? getEffectiveTimeSlotsForDate(selectedDateId, dayRequests)
    : []
  const appointments = selectedDateId
    ? getScheduleAppointmentsForDate(selectedDateId)
    : []
  const times = [...new Set([
    ...availabilitySlots.map((slot) => slot.time),
    ...dayRequests.map((request) => request.time),
  ])].sort()
  const timelineItems = times.map((time) => {
    const slot = availabilitySlots.find((item) => item.time === time)
    const slotRequests = dayRequests.filter((request) => request.time === time)
    const confirmedRequest = slotRequests.find((request) => request.status === 'confirmed')
    const pendingRequests = slotRequests.filter((request) => request.status === 'pending')
    const appointment = confirmedRequest ?? appointments.find((item) => item.time === time)
    const item = { id: `${selectedDateId}|${time}`, time }

    if (confirmedRequest || (selectedDate?.available && slot?.status === 'confirmed')) {
      return { ...appointment, ...item, status: 'confirmed' }
    }

    if (pendingRequests.length) {
      return { ...item, status: 'pending', pendingCount: pendingRequests.length }
    }

    if (slot?.isManualBlock) {
      return { ...item, status: 'blocked', isManualBlock: true }
    }

    return {
      ...item,
      status: selectedDate?.available && slot?.status === 'available'
        ? 'available'
        : 'unavailable',
    }
  })
  const isCompleted = (item) =>
    selectedDateId < referenceDateId ||
    (selectedDateId === referenceDateId && item.time <= requestContext.currentTime)
  const confirmedItems = timelineItems.filter((item) => item.status === 'confirmed')
  const completedCount = confirmedItems.filter(isCompleted).length
  const pendingAttentionCount = confirmedItems.length - completedCount
  const nextAppointment = confirmedItems.find((item) => !isCompleted(item))

  const updateManualBlock = (slot) => {
    const result = slot.isManualBlock
      ? unblockTimeSlot(selectedDateId, slot.time)
      : blockTimeSlot(selectedDateId, slot.time, dayRequests)

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
        ? `Bloqueo de ${slot.time} retirado para esta fecha.`
        : `${slot.time} quedó bloqueada para esta fecha.`,
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
              aria-label={`${formatRequestDateId(date.id)}${date.available ? '' : ', día libre'}`}
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
            onToggleBlock={() => updateManualBlock(item)}
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
