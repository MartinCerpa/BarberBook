import { formatBookingDate } from '../../utils/formatters'

function BookingSuccess({ booking, service, onReturn }) {
  return (
    <div className="booking-success">
      <span className="booking-success__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m7 12 3 3 7-7" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>
      <p className="eyebrow">Solicitud enviada</p>
      <h1>Tu hora está pendiente de confirmación</h1>
      <p className="booking-success__message">
        El barbero revisará tu solicitud y decidirá si puede confirmar la hora.
      </p>

      <dl className="booking-success__summary">
        <div>
          <dt>Servicio</dt>
          <dd>{service.name}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{formatBookingDate(booking.dateId)}</dd>
        </div>
        <div>
          <dt>Hora</dt>
          <dd>{booking.time}</dd>
        </div>
      </dl>

      <button className="button button--primary" type="button" onClick={onReturn}>
        Volver al perfil
      </button>
    </div>
  )
}

export default BookingSuccess
