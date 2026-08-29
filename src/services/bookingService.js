import { initialRequests } from '../data/requests.js'

const copyBooking = (booking) =>
  booking.customer
    ? { ...booking, customer: { ...booking.customer } }
    : { ...booking }

let bookings = initialRequests.map(copyBooking)
let bookingSequence = bookings.length

const updateBookingStatus = (bookingId, status) => {
  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId)

  if (bookingIndex < 0) {
    throw new Error(`Booking not found: ${bookingId}`)
  }

  const updatedBooking = { ...bookings[bookingIndex], status }
  bookings = bookings.map((booking, index) =>
    index === bookingIndex ? updatedBooking : booking,
  )

  return copyBooking(updatedBooking)
}

export const getBookings = async () => bookings.map(copyBooking)

export const createBooking = async (bookingData) => {
  bookingSequence += 1
  const booking = {
    status: 'pending',
    ...bookingData,
    id:
      bookingData.id ??
      `request-${String(bookingSequence).padStart(3, '0')}`,
  }

  bookings = [...bookings, booking]
  return copyBooking(booking)
}

export const confirmBooking = async (bookingId) =>
  updateBookingStatus(bookingId, 'confirmed')

export const rejectBooking = async (bookingId) =>
  updateBookingStatus(bookingId, 'rejected')

export const bookingService = {
  getBookings,
  createBooking,
  confirmBooking,
  rejectBooking,
}
