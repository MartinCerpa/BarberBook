import { useEffect, useState } from 'react'
import AdminPanelPage from './pages/AdminPanelPage'
import PublicBarberPage from './pages/PublicBarberPage'

const adminSections = new Set([
  'dashboard',
  'requests',
  'schedule',
  'clients',
  'services',
  'settings',
])

const getAdminSection = () => {
  const [area, section] = window.location.hash.replace(/^#\/?/, '').split('/')

  if (area !== 'panel') {
    return null
  }

  return adminSections.has(section) ? section : 'dashboard'
}

function App() {
  const [adminSection, setAdminSection] = useState(getAdminSection)

  useEffect(() => {
    const syncRoute = () => setAdminSection(getAdminSection())

    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  if (adminSection) {
    return <AdminPanelPage activeSection={adminSection} />
  }

  return <PublicBarberPage />
}

export default App
