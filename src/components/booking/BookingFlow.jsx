import { useEffect, useState } from 'react'
import {
  getBookingDates,
  getEffectiveTimeSlotsForDate,
  subscribeAvailability,
} from '../../services/availabilityService.js'
import BookingProgress from './BookingProgress'
import BookingSuccess from './BookingSuccess'
import BookingSummary from './BookingSummary'
import CustomerForm from './CustomerForm'
import DateSelector from './DateSelector'
import ServiceSelector from './ServiceSelector'
import TimeSelector from './TimeSelector'

const initialBooking = {
  serviceId: '',
  dateId: '',
  time: '',
  customer: {
    name: '',
    phone: '',
  },
}

function BookingFlow({ services, onExit }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [booking, setBooking] = useState(initialBooking)
  const [, refreshAvailability] = useState(0)
  useEffect(() => subscribeAvailability(() => refreshAvailability((value) => value + 1)), [])
  const dates = getBookingDates()
  const slots = booking.dateId ? getEffectiveTimeSlotsForDate(booking.dateId) : []
  const selectedService = services.find(
    (service) => service.id === booking.serviceId,
  )

  const goToStep = (step) => {
    const dateAvailable = dates.some((date) => date.id === booking.dateId && date.available)
    const timeAvailable = slots.some((slot) => slot.time === booking.time && slot.isBookable)
    // Revalida también si los horarios cambian en otra pestaña durante la reserva.
    const nextStep = step >= 2 && !dateAvailable
      ? 1
      : step >= 3 && !timeAvailable ? 2 : step
    setCurrentStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectService = (serviceId) => {
    setBooking((currentBooking) => {
      if (currentBooking.serviceId === serviceId) {
        return currentBooking
      }

      return {
        ...currentBooking,
        serviceId,
        dateId: '',
        time: '',
      }
    })
  }

  const selectDate = (dateId) => {
    setBooking((currentBooking) => ({
      ...currentBooking,
      dateId,
      time: currentBooking.dateId === dateId ? currentBooking.time : '',
    }))
  }

  if (currentStep === 5) {
    return (
      <section className="booking-section" id="inicio">
        <div className="container booking-shell">
          <BookingSuccess
            booking={booking}
            service={selectedService}
            onReturn={onExit}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="booking-section" id="inicio">
      <div className="container booking-shell">
        <div className="booking-topbar">
          <button type="button" onClick={onExit}>
            <span aria-hidden="true">←</span>
            Volver al perfil
          </button>
          <span>Solicitud de reserva</span>
        </div>

        <BookingProgress currentStep={currentStep} onNavigate={goToStep} />

        <div className="booking-card">
          {currentStep === 0 && (
            <ServiceSelector
              services={services}
              selectedId={booking.serviceId}
              onSelect={selectService}
              onBack={onExit}
              onNext={() => goToStep(1)}
            />
          )}

          {currentStep === 1 && (
            <DateSelector
              dates={dates}
              selectedId={booking.dateId}
              onSelect={selectDate}
              onBack={() => goToStep(0)}
              onNext={() => goToStep(2)}
            />
          )}

          {currentStep === 2 && (
            <TimeSelector
              slots={slots}
              selectedTime={booking.time}
              onSelect={(time) =>
                setBooking((currentBooking) => ({ ...currentBooking, time }))
              }
              onBack={() => goToStep(1)}
              onNext={() => goToStep(3)}
            />
          )}

          {currentStep === 3 && (
            <CustomerForm
              customer={booking.customer}
              onChange={(customer) =>
                setBooking((currentBooking) => ({ ...currentBooking, customer }))
              }
              onBack={() => goToStep(2)}
              onNext={() => goToStep(4)}
            />
          )}

          {currentStep === 4 && (
            <BookingSummary
              booking={booking}
              service={selectedService}
              onBack={() => goToStep(3)}
              onSubmit={() => goToStep(5)}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingFlow
