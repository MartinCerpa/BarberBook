import { formatCurrency } from '../utils/formatters'

function ServiceCard({ service, index }) {
  return (
    <article className="service-card">
      <div className="service-card__header">
        <span className="service-card__number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
        </div>
      </div>
      <div className="service-card__details">
        <strong>{formatCurrency(service.price)}</strong>
        <span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {service.duration} min aprox.
        </span>
      </div>
    </article>
  )
}

export default ServiceCard
