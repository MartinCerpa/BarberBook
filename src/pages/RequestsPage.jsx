import { useState } from 'react'
import RequestCard from '../components/admin/RequestCard'

const filters = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'confirmed', label: 'Confirmadas' },
  { id: 'rejected', label: 'Rechazadas' },
]

function RequestsPage({ requests, onStatusChange, onDurationChange }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const visibleRequests =
    activeFilter === 'all'
      ? requests
      : requests.filter((request) => request.status === activeFilter)

  const getCount = (status) =>
    status === 'all'
      ? requests.length
      : requests.filter((request) => request.status === status).length

  return (
    <div className="admin-page requests-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Bandeja de entrada</p>
          <h1>Solicitudes</h1>
          <p>
            Revisa cada petición, ajusta el tiempo si es necesario y decide
            cuáles pasan a tu agenda.
          </p>
        </div>
        <div className="requests-page__pending-count">
          <strong>{getCount('pending')}</strong>
          <span>por revisar</span>
        </div>
      </header>

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

      {visibleRequests.length > 0 ? (
        <section className="requests-grid" aria-live="polite">
          {visibleRequests.map((request) => (
            <RequestCard
              request={request}
              onStatusChange={onStatusChange}
              onDurationChange={onDurationChange}
              key={request.id}
            />
          ))}
        </section>
      ) : (
        <div className="requests-empty" role="status">
          <strong>No hay solicitudes en este estado</strong>
          <p>Puedes revisar otra categoría desde los filtros.</p>
        </div>
      )}
    </div>
  )
}

export default RequestsPage
