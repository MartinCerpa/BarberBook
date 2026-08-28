const historicalStatuses = new Set(['rejected', 'cancelled', 'completed'])

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const isPastRequest = (request, context) => {
  if (request.dayOrder < context.currentDayOrder) {
    return true
  }

  if (request.dayOrder > context.currentDayOrder) {
    return false
  }

  return timeToMinutes(request.time) <= timeToMinutes(context.currentTime)
}

export const isHistoricalRequest = (request, context) =>
  historicalStatuses.has(request.status) || isPastRequest(request, context)

export const sortUpcomingRequests = (requests) =>
  [...requests].sort(
    (firstRequest, secondRequest) =>
      firstRequest.dayOrder - secondRequest.dayOrder ||
      timeToMinutes(firstRequest.time) - timeToMinutes(secondRequest.time),
  )

export const sortHistoryRequests = (requests) =>
  [...requests].sort(
    (firstRequest, secondRequest) =>
      secondRequest.dayOrder - firstRequest.dayOrder ||
      timeToMinutes(secondRequest.time) - timeToMinutes(firstRequest.time),
  )

export const groupRequestsByDate = (requests) =>
  requests.reduce((groups, request) => {
    const existingGroup = groups.find((group) => group.date === request.date)

    if (existingGroup) {
      existingGroup.requests.push(request)
      return groups
    }

    return [...groups, { date: request.date, requests: [request] }]
  }, [])

export const splitDateLabel = (date) => {
  const [dayLabel, ...dateParts] = date.split(',')

  return {
    dayLabel,
    dateLabel: dateParts.join(',').trim(),
  }
}
