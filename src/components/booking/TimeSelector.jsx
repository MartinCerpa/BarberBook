const statusLabels = {
  available: 'Disponible',
  pending: 'Con solicitudes',
  confirmed: 'No disponible',
  blocked: 'Bloqueado',
}

function TimeSelector({ slots, selectedTime, onSelect, onBack, onNext }) {
  const selectedSlot = slots.find((slot) => slot.time === selectedTime)

  return (
    <div className="booking-step booking-step--time">
      <div className="booking-step__heading">
        <p className="eyebrow">Paso 3</p>
        <h1>Selecciona una hora</h1>
        <p>Las horas se muestran según su estado actual.</p>
      </div>

      <div className="time-legend" aria-label="Estados de los horarios">
        <span><i className="is-available" />Disponible</span>
        <span><i className="is-pending" />Con solicitudes</span>
        <span><i className="is-unavailable" />No disponible</span>
      </div>

      <fieldset className="time-options">
        <legend className="sr-only">Selecciona un horario</legend>
        {slots.map((slot) => {
          const isSelectable = ['available', 'pending'].includes(slot.status)
          const isSelected = selectedTime === slot.time

          return (
            <label
              className={`booking-option time-option time-option--${slot.status}${isSelected ? ' is-selected' : ''}`}
              key={slot.time}
            >
              <input
                type="radio"
                name="booking-time"
                value={slot.time}
                checked={isSelected}
                onChange={() => onSelect(slot.time)}
                disabled={!isSelectable}
              />
              <strong>{slot.time}</strong>
              <span>{statusLabels[slot.status]}</span>
            </label>
          )
        })}
      </fieldset>

      {selectedSlot?.status === 'pending' && (
        <div className="pending-warning" role="status">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8v5M12 17h.01M10.3 3.8 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
          </svg>
          <p>
            <strong>Esta hora ya tiene solicitudes pendientes.</strong>
            Puedes solicitarla igualmente. La solicitud quedará pendiente hasta
            que el profesional confirme la reserva.
          </p>
        </div>
      )}

      <div className="booking-actions">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Volver
        </button>
        <button
          className="button button--primary"
          type="button"
          onClick={onNext}
          disabled={!selectedTime}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

export default TimeSelector
