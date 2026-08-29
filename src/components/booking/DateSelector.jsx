function DateSelector({ dates, selectedId, onSelect, onBack, onNext }) {
  return (
    <div className="booking-step booking-step--date">
      <div className="booking-step__heading">
        <p className="eyebrow">Paso 2</p>
        <h1>Elige una fecha</h1>
        <p>Mostramos los próximos días de atención de Matías.</p>
      </div>

      <fieldset className="date-options">
        <legend className="sr-only">Selecciona una fecha disponible</legend>
        {dates.map((date) => {
          const isSelected = selectedId === date.id

          return (
            <label
              className={`booking-option date-option${isSelected ? ' is-selected' : ''}`}
              key={date.id}
            >
              <input
                type="radio"
                name="booking-date"
                value={date.id}
                checked={isSelected}
                onChange={() => onSelect(date.id)}
                disabled={!date.available}
              />
              <span>{date.label}</span>
              <strong>{date.dayNumber}</strong>
              <small>{date.month}</small>
              <em>{date.note}</em>
            </label>
          )
        })}
      </fieldset>

      <div className="booking-actions">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Volver
        </button>
        <button
          className="button button--primary"
          type="button"
          onClick={onNext}
          disabled={!selectedId}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

export default DateSelector
