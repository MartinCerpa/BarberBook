import { useEffect, useRef, useState } from 'react'
import BookingFlow from '../components/booking/BookingFlow'
import LocationLink from '../components/LocationLink'
import { barber } from '../data/barber'
import PublicLayout from '../layouts/PublicLayout'

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function PublicBarberPage() {
  const [isBooking, setIsBooking] = useState(false)
  const [showMobileCta, setShowMobileCta] = useState(false)
  const primaryCtaRef = useRef(null)
  const { business, professional, services } = barber

  useEffect(() => {
    const primaryCta = primaryCtaRef.current

    if (isBooking || !primaryCta || !window.IntersectionObserver) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileCta(!entry.isIntersecting),
      { threshold: 0.35 },
    )

    observer.observe(primaryCta)
    return () => observer.disconnect()
  }, [isBooking])

  useEffect(() => {
    if (isBooking) {
      return undefined
    }

    const revealElements = document.querySelectorAll('[data-reveal]')

    if (!window.IntersectionObserver) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [isBooking])

  const changeView = (bookingIsOpen) => {
    setShowMobileCta(false)
    setIsBooking(bookingIsOpen)
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (isBooking) {
    return (
      <PublicLayout>
        <BookingFlow services={services} onExit={() => changeView(false)} />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <section className="hero-section" id="inicio">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow" data-reveal data-reveal-order="1">
              Perfil profesional
            </p>
            <h1 data-reveal data-reveal-order="2">{professional.name}</h1>
            <p
              className="hero-copy__role"
              data-reveal
              data-reveal-order="3"
            >
              {professional.role}
            </p>
            <p
              className="hero-copy__bio"
              data-reveal
              data-reveal-order="3"
            >
              {professional.bio}
            </p>

            <button
              className="button button--primary booking-cta"
              type="button"
              onClick={() => changeView(true)}
              ref={primaryCtaRef}
              data-reveal
              data-reveal-order="4"
            >
              <span className="booking-cta__icon">
                <CalendarIcon />
              </span>
              <span className="booking-cta__copy">
                <strong>Reservar ahora</strong>
                <small>Elige servicio, fecha y hora</small>
              </span>
              <svg
                className="booking-cta__arrow"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h14M14 7l5 5-5 5" />
              </svg>
            </button>

            <p
              className="booking-assurance"
              data-reveal
              data-reveal-order="5"
            >
              <span aria-hidden="true">✓</span>
              Reserva gratuita. El servicio se paga directamente en la barbería.
            </p>

            <div className="profile-facts">
              <div
                className="profile-location"
                data-reveal
                data-reveal-order="6"
              >
                <LocationLink
                  location={business.location}
                  mapsUrl={business.mapsUrl}
                />
              </div>
              <div
                className="profile-fact"
                data-reveal
                data-reveal-order="7"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <div>
                  <span>Horario general</span>
                  <strong>
                    {business.openingHours.days} · {business.openingHours.time}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div
            className="profile-visual"
            aria-label="Identidad visual de Matías"
            data-reveal
            data-reveal-order="3"
          >
            <div className="profile-visual__lines" aria-hidden="true" />
            <span className="profile-visual__label">Estilo con intención</span>
            <span className="profile-visual__monogram" aria-hidden="true">
              M
            </span>
            <div className="profile-visual__caption">
              <span>Precisión</span>
              <span>Cercanía</span>
              <span>Estilo</span>
            </div>
          </div>
        </div>
      </section>

      {showMobileCta && (
        <div className="mobile-booking-bar">
          <button type="button" onClick={() => changeView(true)}>
            <CalendarIcon />
            <span>Reservar ahora</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </PublicLayout>
  )
}

export default PublicBarberPage
