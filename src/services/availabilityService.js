import {
  getBookingDates as getBaseBookingDates,
  getTimeSlotsForDate as getBaseTimeSlotsForDate,
} from '../data/availability.js'
import {
  getBlockedSlots,
  saveBlockedSlots,
} from './availabilityPreferencesService.js'

const getSlotId = (date, time) => `${date}|${time}`

export const getBookingDates = (totalDays) => getBaseBookingDates(totalDays)

export const getEffectiveTimeSlotsForDate = (dateId, requestsForDate) => {
  const blockedSlotIds = new Set(
    getBlockedSlots().map((slot) => getSlotId(slot.date, slot.time)),
  )

  return getBaseTimeSlotsForDate(dateId).map((slot) => {
    const slotRequests = requestsForDate?.filter(
      (request) => request.time === slot.time,
    )
    let status = slot.status

    if (slotRequests) {
      if (
        slot.status === 'confirmed' ||
        slotRequests.some((request) => request.status === 'confirmed')
      ) {
        status = 'confirmed'
      } else if (slotRequests.some((request) => request.status === 'pending')) {
        status = 'pending'
      } else if (slot.status === 'pending') {
        // En el panel, las solicitudes reales sustituyen el marcador del mock.
        status = 'available'
      }
    }

    const isManualBlock =
      (status === 'available' || (!slotRequests && status === 'pending')) &&
      blockedSlotIds.has(getSlotId(dateId, slot.time))

    return {
      ...slot,
      status: isManualBlock ? 'blocked' : status,
      isManualBlock,
    }
  })
}

export const blockTimeSlot = (date, time, requestsForDate) => {
  const effectiveSlot = getEffectiveTimeSlotsForDate(date, requestsForDate).find(
    (slot) => slot.time === time,
  )

  if (
    !effectiveSlot ||
    (effectiveSlot.status !== 'available' && !effectiveSlot.isManualBlock)
  ) {
    return { success: false, reason: 'unavailable' }
  }

  const blockedSlots = getBlockedSlots()
  const slotId = getSlotId(date, time)

  if (
    blockedSlots.some((slot) => getSlotId(slot.date, slot.time) === slotId)
  ) {
    return { success: true, blockedSlots, changed: false }
  }

  const result = saveBlockedSlots([...blockedSlots, { date, time }])

  return { ...result, changed: result.success }
}

export const unblockTimeSlot = (date, time) => {
  const slotId = getSlotId(date, time)
  const blockedSlots = getBlockedSlots()
  const nextBlockedSlots = blockedSlots.filter(
    (slot) => getSlotId(slot.date, slot.time) !== slotId,
  )

  if (nextBlockedSlots.length === blockedSlots.length) {
    return { success: true, blockedSlots, changed: false }
  }

  const result = saveBlockedSlots(nextBlockedSlots)

  return { ...result, changed: result.success }
}

export const availabilityService = {
  getBookingDates,
  getEffectiveTimeSlotsForDate,
  blockTimeSlot,
  unblockTimeSlot,
}
