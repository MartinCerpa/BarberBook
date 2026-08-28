import { useMemo, useState } from 'react'
import RequestCard from '../components/admin/RequestCard'
import RequestHistoryCard from '../components/admin/RequestHistoryCard'
import { requestContext } from '../data/requests'
import {
  groupRequestsByDate,
  isHistoricalRequest,
  isPastRequest,
  sortHistoryRequests,
  sortUpcomingRequests,
  splitDateLabel,
} from '../utils/requestUtils'

const upcomingFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'confirmed', label: 'Confirmadas' },
]

const historyFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'past', label: 'Pasadas' },
  { id: 'rejected', label: 'Rechazadas' },
  { id: 'cancelled', label: 'Canceladas' },
  { id: 'completed', label: 'Completadas' },
]

function RequestsPage({
  requests,
  feedback,
  onUndo,
  onStatusChange,
  onDurationChange,
  onTimeChange,
}) {
  const [activeView, setActiveView] = useState('upcoming')
  const [activeFilter, setActiveFilter] = useState('all')

  const upcomingRequests = useMemo(
    () =>
      sortUpcomingRequests(
        requests.filter(
          (request) => !isHistoricalRequest(request, requestContext),
        ),
      ),
    [requests],
  )

  const historyRequests = useMemo(
    () =>
      sortHistoryRequests(
        requests.filter((request) =>
          isHistoricalRequest(request, requestContext),
        ),
      ),
    [requests],
  )

  const activeRequests =
    activeView === 'upcoming' ? upcomingRequests : historyRequests
  const filters = activeView === 'upcoming' ? upcomingFilters : historyFilters
  const visibleRequests = activeRequests.filter((request) => {
    if (activeFilter === 'all') {
      return true
    }

    if (activeFilter === 'past') {
      return isPastRequest(request, requestContext)
    }

    return request.status === activeFilter
  })
  const groupedRequests = groupRequestsByDate(visibleRequests)
  const pendingCount = upcomingRequests.filter(
    (request) => request.status === 'pending',
  ).length

  const getCount = (filterId) => {
    if (filterId === 'all') {
      return activeRequests.length
    }

    if (filterId === 'past') {
      return activeRequests.filter((request) =>
        isPastRequest(request, requestContext),
      ).length
    }

    return activeRequests.filter((request) => request.status === filterId).length
  }

  const selectView = (view) => {
    setActiveView(view)
    setActiveFilter('all')
  }

  return (
    <div className="admin-page requests-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Gestión de reservas</p>
          <h1>Solicitudes</h1>
          <p>
            Revisa primero las próximas atenciones y conserva las decisiones
            anteriores en un historial separado.
          </p>
        </div>
        <div className="requests-page__pending-count">
          <strong>{pendingCount}</strong>
          <span>por revisar</span>
        </div>
      </header>

      <div
        className="request-view-switcher"
        role="tablist"
        aria-label="Vistas de solicitudes"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'upcoming'}
          onClick={() => selectView('upcoming')}
        >
          <span>Solicitudes próximas</span>
          <strong>{upcomingRequests.length}</strong>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'history'}
          onClick={() => selectView('history')}
        >
          <span>Historial</span>
          <strong>{historyRequests.length}</strong>
        </button>
      </div>

      <div className="request-list-heading">
        <div>
          <p className="eyebrow">
            {activeView === 'upcoming' ? 'Orden cronológico' : 'Registro reciente'}
          </p>
          <h2>
            {activeView === 'upcoming'
              ? 'Próximas atenciones'
              : 'Historial de solicitudes'}
          </h2>
        </div>
        {activeView === 'upcoming' && (
          <p>
            Referencia simulada: hoy a las {requestContext.currentTime}
          </p>
        )}
      </div>

      <div className="request-filters" role="group" aria-label="Filtrar solicitudes">
        {filters.map((filter) => (
          <button
            type="button"
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
            key={filter.id}
          >
            {filter.label}
            <span>{getCount(filter.id)}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`request-feedback${
            feedback.isClosing ? ' request-feedback--closing' : ''
          }`}
          role="status"
          aria-live="polite"
        >
          <span>{feedback.message}</span>
          <button type="button" onClick={onUndo}>
            Deshacer
          </button>
        </div>
      )}

      {visibleRequests.length > 0 ? (
        <div className="request-groups" role="tabpanel">
          {activeView === 'upcoming'
            ? groupedRequests.map((group) => {
                const { dayLabel, dateLabel } = splitDateLabel(group.date)

                return (
                  <section className="request-day-group" key={group.date}>
                    <header className="request-day-group__heading">
                      <h3>{dayLabel}</h3>
                      <span>{dateLabel}</span>
                    </header>
                    <div
                      className="requests-grid"
                      aria-label={`Solicitudes para ${group.date}`}
                    >
                      {group.requests.map((request) => (
                        <RequestCard
                          request={request}
                          onStatusChange={onStatusChange}
                          onDurationChange={onDurationChange}
                          onTimeChange={onTimeChange}
                          key={request.id}
                        />
                      ))}
                    </div>
                  </section>
                )
              })
            : (
                <section
                  className="request-history-grid"
                  aria-label="Historial de solicitudes"
                >
                  {visibleRequests.map((request) => (
                    <RequestHistoryCard
                      request={request}
                      context={requestContext}
                      key={request.id}
                    />
                  ))}
                </section>
              )}
        </div>
      ) : (
        <div className="requests-empty" role="status">
          <strong>No hay solicitudes en esta categoría</strong>
          <p>Puedes revisar otra vista o cambiar el filtro seleccionado.</p>
        </div>
      )}
    </div>
  )
}

export default RequestsPage
