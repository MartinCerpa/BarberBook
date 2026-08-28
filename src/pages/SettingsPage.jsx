const settingsItems = [
  {
    id: 'profile',
    title: 'Perfil profesional',
    description: 'Identidad pública, presentación, ubicación y canales de contacto.',
  },
  {
    id: 'services',
    title: 'Servicios',
    description: 'Catálogo, duración y valores que se ofrecen durante la reserva.',
  },
  {
    id: 'hours',
    title: 'Horarios',
    description: 'Jornada habitual, descansos y disponibilidad general.',
  },
  {
    id: 'bookings',
    title: 'Reservas',
    description: 'Criterios de confirmación, anticipación y reglas del flujo.',
  },
  {
    id: 'preferences',
    title: 'Preferencias',
    description: 'Experiencia del panel, avisos y preferencias personales.',
  },
]

function SettingsIcon({ section }) {
  const icons = {
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    services: (
      <>
        <path d="M4 6.5h16M4 12h16M4 17.5h16" />
        <circle cx="8" cy="6.5" r="1.8" />
        <circle cx="15" cy="12" r="1.8" />
        <circle cx="10" cy="17.5" r="1.8" />
      </>
    ),
    hours: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    bookings: (
      <>
        <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16M8 14l2.2 2.2L16 13" />
      </>
    ),
    preferences: (
      <>
        <path d="M4 7h4M12 7h8M4 12h9M17 12h3M4 17h2M10 17h10" />
        <circle cx="10" cy="7" r="2" />
        <circle cx="15" cy="12" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[section]}
    </svg>
  )
}

function SettingsPage() {
  return (
    <div className="admin-page settings-page">
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Espacio preparado para crecer</p>
          <h1>Configuración</h1>
          <p>
            La futura gestión del negocio estará organizada en áreas claras,
            sin añadir controles que todavía no forman parte del MVP.
          </p>
        </div>
        <span className="settings-page__status">Vista preliminar</span>
      </header>

      <section className="settings-grid" aria-label="Áreas de configuración futuras">
        {settingsItems.map((item) => (
          <article className="settings-option" key={item.id}>
            <span className="settings-option__icon">
              <SettingsIcon section={item.id} />
            </span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <span className="settings-option__badge">Próximamente</span>
          </article>
        ))}
      </section>
    </div>
  )
}

export default SettingsPage
