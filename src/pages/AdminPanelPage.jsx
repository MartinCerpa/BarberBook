import { useEffect, useMemo, useRef, useState } from 'react'
import { requestContext } from '../data/requests'
import {
  getRequestsSnapshot, subscribeBookings, undoBookingChange,
  updateBookingDetails, updateBookingStatus,
} from '../services/bookingService'
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
  const [requests, setRequests] = useState(getRequestsSnapshot)
  const [requestFeedback, setRequestFeedback] = useState(null)
  const [requestFocus, setRequestFocus] = useState(null)
  const feedbackTimerRef = useRef(null)
  const feedbackRemovalTimerRef = useRef(null)
  useEffect(() => subscribeBookings(() => setRequests(getRequestsSnapshot())), [])
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

  const updateRequestStatus = async (requestId, status) => {
    const currentRequest = requests.find((request) => request.id === requestId)

    if (!currentRequest) {
      return { success: false, error: 'No encontramos esta solicitud.' }
    }

    if (currentRequest.status === status) {
      return { success: true, changed: false, booking: currentRequest }
    }

    const result = await updateBookingStatus(requestId, status)
    if (!result.success) {
      setRequestFeedback({ message: result.error })
      return result
    }

    window.clearTimeout(feedbackTimerRef.current)
    window.clearTimeout(feedbackRemovalTimerRef.current)
    setRequestFeedback({
      requestId,
      undoToken: result.undoToken,
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
    return result
  }

  const undoRequestStatus = async () => {
    if (!requestFeedback?.undoToken) {
      return
    }

    const result = await undoBookingChange(requestFeedback.undoToken)
    if (!result.success) {
      setRequestFeedback({ message: result.error })
      return
    }
    window.clearTimeout(feedbackTimerRef.current)
    window.clearTimeout(feedbackRemovalTimerRef.current)
    setRequestFeedback(null)
  }

  const updateRequestDuration = async (requestId, duration) => {
    const result = await updateBookingDetails(requestId, { duration })
    if (!result.success) setRequestFeedback({ message: result.error })
  }

  const updateRequestTime = async (requestId, time) => {
    const result = await updateBookingDetails(requestId, { time })
    if (!result.success) setRequestFeedback({ message: result.error })
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
          pendingRequestCount={pendingRequests}
          onConfirmRequest={(requestId) =>
            updateRequestStatus(requestId, 'confirmed')
          }
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
