const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  rejected: 'Rechazada',
}

const durationOptions = [30, 45, 60, 75, 90]

function RequestCard({ request, onStatusChange, onDurationChange }) {
  const isPending = request.status === 'pending'

  return (
    <article className={`request-card request-card--${request.status}`}>
      <header className="request-card__header">
        <div>
          <span className="request-card__reference">
            Solicitud {request.id.slice(-3)}
          </span>
          <h2>{request.customerName}</h2>
          <a href={`tel:${request.phone.replace(/\s/g, '')}`}>{request.phone}</a>
        </div>
        <span className={`status-badge status-badge--${request.status}`}>
          {statusLabels[request.status]}
        </span>
      </header>

      <dl className="request-card__details">
        <div>
          <dt>Servicio</dt>
          <dd>{request.service}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{request.date}</dd>
        </div>
        <div>
          <dt>Hora</dt>
          <dd>{request.time}</dd>
        </div>
      </dl>

      <div className="request-card__duration">
        <div>
          <strong>Duración del servicio</strong>
          <span>Sugerencia: {request.suggestedDuration} minutos</span>
        </div>
        {isPending ? (
          <label>
            <span className="sr-only">
              Ajustar duración para la solicitud de {request.customerName}
            </span>
            <select
              value={request.duration}
              onChange={(event) =>
                onDurationChange(request.id, Number(event.target.value))
              }
            >
              {durationOptions.map((duration) => (
                <option value={duration} key={duration}>
                  {duration} min
                </option>
              ))}
            </select>
          </label>
        ) : (
          <strong>{request.duration} min</strong>
        )}
      </div>

      {isPending ? (
        <div className="request-card__actions">
          <button
            className="request-action request-action--reject"
            type="button"
            onClick={() => onStatusChange(request.id, 'rejected')}
          >
            Rechazar
          </button>
          <button
            className="request-action request-action--accept"
            type="button"
            onClick={() => onStatusChange(request.id, 'confirmed')}
          >
            Aceptar solicitud
          </button>
        </div>
      ) : (
        <p className="request-card__resolution" role="status">
          {request.status === 'confirmed'
            ? 'Confirmada manualmente por el barbero.'
            : 'La solicitud fue rechazada.'}
        </p>
      )}
    </article>
  )
}

export default RequestCard
