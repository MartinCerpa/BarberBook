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

export const getEffectiveTimeSlotsForDate = (dateId) => {
  const blockedSlotIds = new Set(
    getBlockedSlots().map((slot) => getSlotId(slot.date, slot.time)),
  )

  return getBaseTimeSlotsForDate(dateId).map((slot) => {
    const isManualBlock =
      slot.status === 'available' &&
      blockedSlotIds.has(getSlotId(dateId, slot.time))

    return {
      ...slot,
      status: isManualBlock ? 'blocked' : slot.status,
      isManualBlock,
    }
  })
}

export const blockTimeSlot = (date, time) => {
  const baseSlot = getBaseTimeSlotsForDate(date).find(
    (slot) => slot.time === time,
  )

  if (!baseSlot || baseSlot.status !== 'available') {
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
