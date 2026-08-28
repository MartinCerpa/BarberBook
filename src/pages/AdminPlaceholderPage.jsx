const placeholderContent = {
  clients: {
    eyebrow: 'Próxima etapa',
    title: 'Clientes',
    description:
      'Aquí podrás consultar el historial de visitas y reconocer a tus clientes recurrentes.',
    features: ['Historial de reservas', 'Servicios frecuentes', 'Datos de contacto'],
  },
  settings: {
    eyebrow: 'Próxima etapa',
    title: 'Configuración',
    description:
      'Este espacio reunirá tus servicios, horarios de atención y preferencias del perfil.',
    features: ['Servicios y precios', 'Horario de atención', 'Perfil profesional'],
  },
}

function AdminPlaceholderPage({ section }) {
  const content = placeholderContent[section]

  return (
    <section className="admin-page admin-placeholder">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      <div className="placeholder-features">
        {content.features.map((feature, index) => (
          <div key={feature}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{feature}</strong>
            <small>Preparado para crecer</small>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminPlaceholderPage
