const weekdaySchedule = [
  { time: '10:00', status: 'available' },
  { time: '11:00', status: 'pending' },
  { time: '12:00', status: 'confirmed' },
  { time: '13:00', status: 'blocked' },
  { time: '15:00', status: 'available' },
  { time: '16:00', status: 'pending' },
  { time: '17:00', status: 'available' },
  { time: '18:00', status: 'available' },
]

const saturdaySchedule = [
  { time: '10:00', status: 'pending' },
  { time: '11:00', status: 'available' },
  { time: '12:00', status: 'confirmed' },
  { time: '13:00', status: 'available' },
  { time: '14:00', status: 'blocked' },
  { time: '15:00', status: 'available' },
]

const toDateId = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getBookingDates = (totalDays = 14) => {
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    const isSunday = date.getDay() === 0

    return {
      id: toDateId(date),
      label:
        index === 0
          ? 'Hoy'
          : new Intl.DateTimeFormat('es-CL', { weekday: 'short' })
              .format(date)
              .replace('.', ''),
      dayNumber: date.getDate(),
      month: new Intl.DateTimeFormat('es-CL', { month: 'short' })
        .format(date)
        .replace('.', ''),
      available: !isSunday,
      note: isSunday ? 'Día libre' : 'Disponible',
    }
  })
}

export const getTimeSlotsForDate = (dateId) => {
  const date = new Date(`${dateId}T12:00:00`)
  const schedule = date.getDay() === 6 ? saturdaySchedule : weekdaySchedule

  return schedule.map((slot) => ({ ...slot }))
}
