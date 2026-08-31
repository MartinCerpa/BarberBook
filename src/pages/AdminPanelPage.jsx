import { useEffect, useMemo, useRef, useState } from 'react'
import { initialRequests, requestContext } from '../data/requests'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboardPage from './AdminDashboardPage'
import AdminPlaceholderPage from './AdminPlaceholderPage'
import ClientsPage from './ClientsPage'
import RequestsPage from './RequestsPage'
import SchedulePage from './SchedulePage'
import ServicesPage from './ServicesPage'
import SettingsPage from './SettingsPage'
import { isHistoricalRequest } from '../utils/requestUtils'

const requestStatusMessages = {
  confirmed: 'Reserva confirmada correctamente.',
  rejected: 'Solicitud rechazada.',
  pending: 'Reserva devuelta al estado pendiente.',
  cancelled: 'Reserva cancelada.',
}

function AdminPanelPage({ activeSection, navigationKey, onNavigate }) {
  const [requests, setRequests] = useState(initialRequests)
  const [requestFeedback, setRequestFeedback] = useState(null)
  const [requestFocus, setRequestFocus] = useState(null)
  const feedbackTimerRef = useRef(null)
  const feedbackRemovalTimerRef = useRef(null)
  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === 'pending' &&
          !isHistoricalRequest(request, requestContext),
      ).length,
    [requests],
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeSection, navigationKey])

  useEffect(
    () => () => {
      window.clearTimeout(feedbackTimerRef.current)
      window.clearTimeout(feedbackRemovalTimerRef.current)
    },
    [],
  )

  const updateRequestStatus = (requestId, status) => {
    const currentRequest = requests.find((request) => request.id === requestId)

    if (!currentRequest || currentRequest.status === status) {
      return
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request,
      ),
    )

    window.clearTimeout(feedbackTimerRef.current)
    window.clearTimeout(feedbackRemovalTimerRef.current)
    setRequestFeedback({
      requestId,
      previousStatus: currentRequest.status,
      message: requestStatusMessages[status],
    })
    feedbackTimerRef.current = window.setTimeout(
      () => {
        setRequestFeedback((currentFeedback) =>
          currentFeedback ? { ...currentFeedback, isClosing: true } : null,
        )
        feedbackRemovalTimerRef.current = window.setTimeout(
          () => setRequestFeedback(null),
          280,
        )
      },
      5500,
    )
  }

  const undoRequestStatus = () => {
    if (!requestFeedback) {
      return
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestFeedback.requestId
          ? { ...request, status: requestFeedback.previousStatus }
          : request,
      ),
    )
    window.clearTimeout(feedbackTimerRef.current)
    window.clearTimeout(feedbackRemovalTimerRef.current)
    setRequestFeedback(null)
  }

  const updateRequestDuration = (requestId, duration) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, duration } : request,
      ),
    )
  }

  const updateRequestTime = (requestId, time) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, time } : request,
      ),
    )
  }

  const renderSection = () => {
    if (activeSection === 'dashboard') {
      return <AdminDashboardPage pendingRequests={pendingRequests} />
    }

    if (activeSection === 'requests') {
      return (
        <RequestsPage
          requests={requests}
          initialFocus={requestFocus}
          onFocusConsumed={() => setRequestFocus(null)}
          feedback={requestFeedback}
          onUndo={undoRequestStatus}
          onStatusChange={updateRequestStatus}
          onDurationChange={updateRequestDuration}
          onTimeChange={updateRequestTime}
        />
      )
    }

    if (activeSection === 'schedule') {
      return (
        <SchedulePage
          requests={requests}
          onViewRequests={(slot) => {
            setRequestFocus(slot)
            window.location.hash = '/panel/requests'
          }}
        />
      )
    }

    if (activeSection === 'clients') {
      return <ClientsPage />
    }

    if (activeSection === 'services') {
      return <ServicesPage />
    }

    if (activeSection === 'settings') {
      return <SettingsPage />
    }

    return <AdminPlaceholderPage section={activeSection} />
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      navigationKey={navigationKey}
      onNavigate={onNavigate}
    >
      {renderSection()}
    </AdminLayout>
  )
}

export default AdminPanelPage
