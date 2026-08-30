export const BLOCKED_SLOTS_STORAGE_KEY = 'barberbook:blocked-slots:v1'

const getStorage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

const isValidDateId = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

const isValidTime = (value) => {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) {
    return false
  }

  const [hours, minutes] = value.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

export const sanitizeBlockedSlots = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  const blockedSlots = []
  const seenSlots = new Set()

  value.forEach((slot) => {
    if (
      !slot ||
      typeof slot !== 'object' ||
      Array.isArray(slot) ||
      !isValidDateId(slot.date) ||
      !isValidTime(slot.time)
    ) {
      return
    }

    const slotId = `${slot.date}|${slot.time}`

    if (seenSlots.has(slotId)) {
      return
    }

    seenSlots.add(slotId)
    blockedSlots.push({ date: slot.date, time: slot.time })
  })

  return blockedSlots
}

export const getBlockedSlots = () => {
  const storage = getStorage()

  if (!storage) {
    return []
  }

  try {
    const storedValue = storage.getItem(BLOCKED_SLOTS_STORAGE_KEY)
    return storedValue ? sanitizeBlockedSlots(JSON.parse(storedValue)) : []
  } catch {
    return []
  }
}

export const saveBlockedSlots = (value) => {
  const storage = getStorage()
  const blockedSlots = sanitizeBlockedSlots(value)

  if (!storage) {
    return { success: false, blockedSlots: [] }
  }

  try {
    if (blockedSlots.length) {
      storage.setItem(BLOCKED_SLOTS_STORAGE_KEY, JSON.stringify(blockedSlots))
    } else {
      storage.removeItem(BLOCKED_SLOTS_STORAGE_KEY)
    }

    return { success: true, blockedSlots }
  } catch {
    return { success: false, blockedSlots: getBlockedSlots() }
  }
}

export const availabilityPreferencesService = {
  getBlockedSlots,
  saveBlockedSlots,
}
