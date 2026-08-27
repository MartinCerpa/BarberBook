import { useState } from 'react'
import BookingFlow from '../components/booking/BookingFlow'
import LocationLink from '../components/LocationLink'
import ServiceCard from '../components/ServiceCard'
import { barber } from '../data/barber'
import PublicLayout from '../layouts/PublicLayout'

function PublicBarberPage() {
  const [isBooking, setIsBooking] = useState(false)
  const { business, professional, services } = barber

  const changeView = (bookingIsOpen) => {
    setIsBooking(bookingIsOpen)
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (isBooking) {
    return (
      <PublicLayout>
        <BookingFlow
          services={services}
          bookingFee={business.bookingFee}
          onExit={() => changeView(false)}
        />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <section className="hero-section" id="inicio">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Perfil profesional</p>
            <h1>{professional.name}</h1>
            <p className="hero-copy__role">{professional.role}</p>
            <p className="hero-copy__bio">{professional.bio}</p>
            <LocationLink
              location={business.location}
              mapsUrl={business.mapsUrl}
            />
            <button
              className="button button--primary"
              type="button"
              onClick={() => changeView(true)}
            >
              Reservar hora
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M14 7l5 5-5 5" />
              </svg>
            </button>
          </div>

          <div className="profile-visual" aria-label="Identidad visual de Matías">
            <div className="profile-visual__lines" aria-hidden="true" />
            <span className="profile-visual__label">Estilo con intención</span>
            <span className="profile-visual__monogram" aria-hidden="true">
              M
            </span>
            <div className="profile-visual__caption">
              <span>Corte</span>
              <span>Barba</span>
              <span>Detalle</span>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="servicios">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Servicios</p>
              <h2>Elige tu próxima experiencia</h2>
            </div>
            <p>
              Cada servicio se adapta a tu estilo. La duración es aproximada y
              se confirma antes de la reserva.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="booking-note">
            <div>
              <span className="booking-note__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                </svg>
              </span>
              <div>
                <strong>Solicitudes sujetas a confirmación</strong>
                <p>
                  Matías revisará cada solicitud antes de confirmar la hora.
                  Enviar una solicitud no bloquea ni confirma automáticamente.
                </p>
              </div>
            </div>
            <a href={business.mapsUrl} target="_blank" rel="noreferrer">
              Cómo llegar
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default PublicBarberPage
