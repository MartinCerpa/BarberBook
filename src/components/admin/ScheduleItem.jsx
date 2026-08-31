const statusLabels = {
  available: 'Disponible',
  confirmed: 'Confirmada',
  blocked: 'Bloqueada',
  pending: 'Con solicitudes',
  unavailable: 'No disponible',
}

const actionLabels = {
  block: 'Bloquear',
  unblock: 'Desbloquear',
  enable: 'Habilitar este día',
  restore: 'Restaurar horario',
}

function ScheduleItem({ item, dateLabel, onAvailabilityAction, onViewRequests }) {
  const actionLabel = actionLabels[item.action]

  return (
    <article
      className={`schedule-item schedule-item--${item.status}${item.isNext ? ' is-next' : ''}`}
    >
      <time>{item.time}</time>
      <span className="schedule-item__marker" aria-hidden="true" />
      <div className="schedule-item__content">
        <div>
          {item.status === 'confirmed' ? (
            <>
              <strong>{item.customerName}</strong>
              <span>{item.service} · {item.duration} min</span>
            </>
          ) : (
            <>
              <strong>{statusLabels[item.status]}</strong>
              <span>
                {item.status === 'available'
                  ? item.isEnabledException ? 'Habilitada solo para esta fecha' : 'Espacio libre para nuevas solicitudes'
                  : item.status === 'pending'
                    ? `${item.pendingCount} por revisar`
                    : item.status === 'blocked'
                      ? 'Horario bloqueado por el profesional'
                      : 'Horario no ofrecido para reservas'}
              </span>
            </>
          )}
        </div>
        {item.status === 'confirmed' ? (
          <div className="schedule-item__status">
            {item.isNext && <span>Próximo</span>}
            <span className="status-badge status-badge--confirmed">Confirmada</span>
          </div>
        ) : actionLabel ? (
          <button
            className="schedule-item__action"
            type="button"
            onClick={onAvailabilityAction}
            aria-label={`${actionLabel} ${item.time} del ${dateLabel}`}
          >
            {actionLabel}
          </button>
        ) : item.status === 'pending' ? (
          <button
            className="schedule-item__action"
            type="button"
            onClick={onViewRequests}
            aria-label={`Ver solicitudes de las ${item.time} del ${dateLabel}`}
          >
            Ver <span aria-hidden="true">→</span>
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default ScheduleItem
