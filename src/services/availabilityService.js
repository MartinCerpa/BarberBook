import {
  getBookingDates as getBaseBookingDates,
  getTimeSlotsForDate as getBaseTimeSlotsForDate,
  minutesToTime,
  SLOT_INTERVAL_MINUTES,
  timeToMinutes,
} from '../data/availability.js'
import { initialRequests, requestContext } from '../data/requests.js'
import { getScheduleAppointmentsForDate } from '../data/schedule.js'
import { getRequestDateId, isHistoricalRequest } from '../utils/requestUtils.js'
import {
  AVAILABILITY_CHANGE_EVENT,
  BLOCKED_SLOTS_STORAGE_KEY,
  ENABLED_SLOTS_STORAGE_KEY,
  getBlockedSlots,
  getEnabledSlots,
  isValidDateId,
  isValidTime,
  saveBlockedSlots,
  saveEnabledSlots,
} from './availabilityPreferencesService.js'
import { getWorkingHours, WORKING_HOURS_STORAGE_KEY } from './workingHoursPreferencesService.js'

const getSlotId = (date, time) => date + '|' + time
const storageKeys = new Set([
  BLOCKED_SLOTS_STORAGE_KEY, ENABLED_SLOTS_STORAGE_KEY, WORKING_HOURS_STORAGE_KEY,
])

export const subscribeAvailability = (onChange) => {
  const onStorage = (event) => {
    if (event.key === null || storageKeys.has(event.key)) onChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(AVAILABILITY_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(AVAILABILITY_CHANGE_EVENT, onChange)
  }
}

export const getAvailabilityRequestsForDate = (dateId, requests = initialRequests) => {
  const referenceDateId = getBaseBookingDates(1)[0].id
  return requests.filter((request) =>
    getRequestDateId(request, referenceDateId, requestContext) === dateId &&
    (request.status === 'confirmed' ||
      (request.status === 'pending' && !isHistoricalRequest(request, requestContext))),
  )
}

export const getEffectiveTimeSlotsForDate = (dateId, requestsForDate) => {
  if (!isValidDateId(dateId)) return []
  const weekday = new Date(dateId + 'T12:00:00').getDay()
  const weeklyDay = getWorkingHours().days.find((day) => day.day === weekday)
  const intervals = weeklyDay.enabled ? weeklyDay.intervals : []
  const blocks = getBlockedSlots().filter((slot) => slot.date === dateId)
  const enabled = getEnabledSlots().filter((slot) => slot.date === dateId)
  const blockedTimes = new Set(blocks.map((slot) => slot.time))
  const enabledTimes = new Set(enabled.map((slot) => slot.time))
  const dayRequests = requestsForDate ?? getAvailabilityRequestsForDate(dateId)
  const appointments = getScheduleAppointmentsForDate(dateId)
  const usualTimes = new Set()
  intervals.forEach(({ start, end }) => {
    for (let minutes = timeToMinutes(start); minutes < timeToMinutes(end); minutes += SLOT_INTERVAL_MINUTES) {
      usualTimes.add(minutesToTime(minutes))
    }
  })
  const times = new Set(usualTimes)
  // Conserva los huecos fuera del horario, sin agregar inicios entre los del intervalo.
  getBaseTimeSlotsForDate(dateId).forEach(({ time }) => {
    if (!intervals.some(({ start, end }) => time >= start && time < end)) times.add(time)
  })
  const datedSlots = [...blocks, ...enabled, ...dayRequests, ...appointments]
  datedSlots.forEach(({ time }) => {
    if (isValidTime(time)) times.add(time)
  })

  return [...times].sort().map((time) => {
    const isNormallyAvailable = usualTimes.has(time)
    const isEnabledException = enabledTimes.has(time)
    const slotRequests = dayRequests.filter((request) => request.time === time)
    const confirmed = slotRequests.find((request) => request.status === 'confirmed') ??
      appointments.find((appointment) => appointment.time === time)
    const pendingCount = slotRequests.filter((request) => request.status === 'pending').length
    const offered = isNormallyAvailable || isEnabledException
    let status = offered ? 'available' : 'unavailable'
    let action = offered ? isEnabledException ? 'restore' : 'block' : 'enable'

    // Las atenciones y solicitudes conservan su prioridad sin alterar sus datos.
    if (confirmed) {
      status = 'confirmed'
      action = null
    } else if (pendingCount) {
      status = 'pending'
      action = null
    } else if (blockedTimes.has(time)) {
      status = 'blocked'
      action = 'unblock'
    }

    return {
      ...confirmed,
      id: getSlotId(dateId, time),
      time,
      status,
      action,
      pendingCount,
      isNormallyAvailable,
      isEnabledException,
      isManualBlock: status === 'blocked',
      isBookable: offered && (status === 'available' || status === 'pending'),
    }
  })
}

export const getBookingDates = (totalDays, requests) =>
  getBaseBookingDates(totalDays).map((date) => {
    const available = getEffectiveTimeSlotsForDate(date.id, getAvailabilityRequestsForDate(date.id, requests))
      .some((slot) => slot.isBookable)
    return { ...date, available, note: available ? 'Disponible' : 'Sin horas disponibles' }
  })

const hasAction = (date, time, action, requestsForDate) =>
  getEffectiveTimeSlotsForDate(date, requestsForDate).some((slot) =>
    slot.time === time && slot.action === action,
  )

export const blockTimeSlot = (date, time, requestsForDate) => {
  if (!hasAction(date, time, 'block', requestsForDate) &&
    !hasAction(date, time, 'unblock', requestsForDate)) {
    return { success: false, reason: 'unavailable' }
  }
  const slots = getBlockedSlots()
  if (slots.some((slot) => getSlotId(slot.date, slot.time) === getSlotId(date, time))) {
    return { success: true, changed: false }
  }
  return saveBlockedSlots([...slots, { date, time }])
}

export const unblockTimeSlot = (date, time) =>
  saveBlockedSlots(getBlockedSlots().filter((slot) => getSlotId(slot.date, slot.time) !== getSlotId(date, time)))

export const enableTimeSlot = (date, time, requestsForDate) => {
  if (!hasAction(date, time, 'enable', requestsForDate)) {
    return { success: false, reason: 'unavailable' }
  }
  return saveEnabledSlots([...getEnabledSlots(), { date, time }])
}

export const restoreTimeSlot = (date, time) =>
  saveEnabledSlots(getEnabledSlots().filter((slot) => getSlotId(slot.date, slot.time) !== getSlotId(date, time)))

export const availabilityService = {
  getBookingDates,
  getAvailabilityRequestsForDate,
  getEffectiveTimeSlotsForDate,
  blockTimeSlot,
  unblockTimeSlot,
  enableTimeSlot,
  restoreTimeSlot,
  subscribeAvailability,
}
