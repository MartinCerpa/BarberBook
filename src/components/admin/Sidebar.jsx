const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', number: '01' },
  { id: 'requests', label: 'Solicitudes', number: '02' },
  { id: 'schedule', label: 'Agenda', number: '03' },
  { id: 'clients', label: 'Clientes', number: '04' },
  { id: 'settings', label: 'Configuración', number: '05' },
]

function Sidebar({ activeSection, mobile = false }) {
  return (
    <nav
      className={mobile ? 'admin-mobile-nav' : 'admin-navigation'}
      aria-label="Navegación del panel"
    >
      {navigationItems.map((item) => (
        <a
          href={`#/panel/${item.id}`}
          aria-current={activeSection === item.id ? 'page' : undefined}
          key={item.id}
        >
          <span aria-hidden="true">{item.number}</span>
          <strong>{item.label}</strong>
        </a>
      ))}
    </nav>
  )
}

export default Sidebar
