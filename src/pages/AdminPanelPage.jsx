import { useMemo, useState } from 'react'
import { initialRequests } from '../data/requests'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboardPage from './AdminDashboardPage'
import AdminPlaceholderPage from './AdminPlaceholderPage'
import RequestsPage from './RequestsPage'
import SchedulePage from './SchedulePage'

function AdminPanelPage({ activeSection }) {
  const [requests, setRequests] = useState(initialRequests)
  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === 'pending').length,
    [requests],
  )

  const updateRequestStatus = (requestId, status) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request,
      ),
    )
  }

  const updateRequestDuration = (requestId, duration) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, duration } : request,
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
          onStatusChange={updateRequestStatus}
          onDurationChange={updateRequestDuration}
        />
      )
    }

    if (activeSection === 'schedule') {
      return <SchedulePage />
    }

    return <AdminPlaceholderPage section={activeSection} />
  }

  return (
    <AdminLayout activeSection={activeSection}>
      {renderSection()}
    </AdminLayout>
  )
}

export default AdminPanelPage
