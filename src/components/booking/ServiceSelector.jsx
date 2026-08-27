import { formatCurrency } from '../../utils/formatters'

function ServiceSelector({ services, selectedId, onSelect, onBack, onNext }) {
  return (
    <div className="booking-step">
      <div className="booking-step__heading">
        <p className="eyebrow">Paso 1</p>
        <h1>¿Qué servicio prefieres?</h1>
        <p>Selecciona una opción para comenzar tu solicitud.</p>
      </div>

      <fieldset className="booking-options booking-options--services">
        <legend className="sr-only">Selecciona un servicio</legend>
        {services.map((service) => {
          const isSelected = selectedId === service.id

          return (
            <label
              className={`booking-option service-option${isSelected ? ' is-selected' : ''}`}
              key={service.id}
            >
              <input
                type="radio"
                name="booking-service"
                value={service.id}
                checked={isSelected}
                onChange={() => onSelect(service.id)}
              />
              <span className="booking-option__check" aria-hidden="true" />
              <strong>{service.name}</strong>
              <span className="service-option__description">
                {service.description}
              </span>
              <span className="service-option__details">
                <b>{formatCurrency(service.price)}</b>
                <span>{service.duration} min aprox.</span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <div className="booking-actions">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Volver al perfil
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

export default ServiceSelector
