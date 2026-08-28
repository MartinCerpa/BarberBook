const statusLabels = {
  available: 'Disponible',
  confirmed: 'Confirmada',
  blocked: 'Bloqueada',
}

function ScheduleItem({ item }) {
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
                  ? 'Espacio libre para nuevas solicitudes'
                  : 'Horario reservado por el barbero'}
              </span>
            </>
          )}
        </div>
        <div className="schedule-item__status">
          {item.isNext && <span>Próximo</span>}
          <span className={`status-badge status-badge--${item.status}`}>
            {statusLabels[item.status]}
          </span>
        </div>
      </div>
    </article>
  )
}

export default ScheduleItem
