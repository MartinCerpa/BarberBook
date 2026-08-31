import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import {
  acceptRequest, createBooking, getAppointmentOutcomeOptions, getRequestsSnapshot, getUnfinishedAppointmentDates,
  recordAppointmentOutcome, undoBookingChange, updateBookingDetails, updateBookingStatus,
} from '../src/services/bookingService.js'
import {
  BOOKINGS_STORAGE_KEY, readBookingState,
} from '../src/services/bookingRepository.js'
import {
  getClientHistory, getClientSummary, getCustomersSnapshot, setClientTrustStatus,
} from '../src/services/customerService.js'
import { getEffectiveTimeSlotsForDate, blockTimeSlot } from '../src/services/availabilityService.js'
import { getServices, saveServices } from '../src/services/serviceService.js'
import { normalizeCustomerPhone } from '../src/utils/customerUtils.js'

const originalWindow = globalThis.window
let storage
beforeEach(() => {
  storage = new Map()
  globalThis.window = Object.assign(new EventTarget(), { localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  } })
})
afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

const dateId = '2030-01-07'
const at = (time) => new Date(`${dateId}T${time}:00`)
const request = (id = 'request-a1', time = '15:00', phone = '81895314') => createBooking({
  id, serviceId: 'haircut', dateId, time, customer: { name: 'Cliente A1', phone },
})
const confirmed = async (id, time, phone) => {
  const created = await request(id, time, phone)
  assert.equal(created.success, true, created.error)
  const accepted = acceptRequest(created.booking.id)
  assert.equal(accepted.success, true, accepted.error)
  return accepted.booking
}
const outcome = (booking, result, time = '18:00') => recordAppointmentOutcome({
  appointmentId: booking.appointmentId, outcome: result,
}, at(time))

test('teléfonos equivalentes identifican al mismo cliente, sin cuenta', async () => {
  for (const phone of ['81895314', '981895314', '+56 9 8189 5314', '+56981895314']) {
    assert.equal(normalizeCustomerPhone(phone), '+56981895314')
  }
  assert.equal(normalizeCustomerPhone('abc81895314'), null)
  const first = await request('request-one')
  const second = await request('request-two', '16:00', '+56 9 8189 5314')
  assert.equal(first.booking.customerId, second.booking.customerId)
  assert.equal(getCustomersSnapshot().filter((client) => client.phone === '+56981895314').length, 1)
  assert.equal(first.booking.status, 'pending')
})

test('envío y aceptación idempotentes conservan identificadores y una sola reserva', async () => {
  const sent = await Promise.all([request(), request()])
  assert.equal(sent.every((result) => result.success), true)
  const first = acceptRequest(sent[0].booking.id)
  const second = acceptRequest(sent[0].booking.id)
  assert.equal(first.booking.appointmentId, second.booking.appointmentId)
  assert.equal(second.changed, false)
  assert.equal(readBookingState().records.filter((record) => record.id === first.booking.id).length, 1)
})

test('completar crea un historial, suma precio y última visita; repetir no duplica', async () => {
  const booking = await confirmed()
  assert.equal(outcome(booking, 'completed').success, true)
  assert.equal(outcome(booking, 'completed').changed, false)
  const summary = getClientSummary(booking.customerId)
  assert.equal(summary.completedAppointments, 1)
  assert.equal(summary.totalSpent, 12000)
  assert.equal(summary.lastVisit, dateId)
  assert.equal(summary.history.length, 1)
  assert.equal(summary.history[0].appointmentId, booking.appointmentId)
  assert.equal(summary.history[0].service, 'Corte de cabello')
  assert.equal(summary.history[0].time, '15:00')
})

test('completar exige término previsto y rechaza una reserva futura', async () => {
  const booking = await confirmed()
  assert.equal(outcome(booking, 'completed', '14:00').success, false)
  assert.equal(outcome(booking, 'completed', '15:44').success, false)
  assert.equal(getAppointmentOutcomeOptions(booking, at('15:44'))[0].enabled, false)
  assert.equal(outcome(booking, 'completed', '15:45').success, true)
})

test('cancelada registra historial pero no gasto, completadas ni inasistencias', async () => {
  const booking = await confirmed()
  assert.equal(outcome(booking, 'cancelled', '14:00').success, true)
  const summary = getClientSummary(booking.customerId)
  assert.equal(summary.history[0].outcome, 'cancelled')
  assert.equal(summary.totalSpent, 0)
  assert.equal(summary.completedAppointments, 0)
  assert.equal(summary.noShows, 0)
  assert.equal(summary.lastVisit, null)
  assert.equal(summary.trustStatus, 'normal')
  assert.equal(getEffectiveTimeSlotsForDate(dateId).find((slot) => slot.time === '15:00').isBookable, true)
})

test('no_show antes de +15m es rechazado por el servicio y desde +15m permitido', async () => {
  const booking = await confirmed()
  assert.equal(recordAppointmentOutcome({ appointmentId: booking.appointmentId, outcome: 'no_show' },
    new Date(`${dateId}T15:14:59.999`)).success, false)
  assert.equal(getClientHistory(booking.customerId).length, 0)
  assert.equal(outcome(booking, 'no_show', '15:15').success, true)
  const summary = getClientSummary(booking.customerId)
  assert.equal(summary.noShows, 1)
  assert.equal(summary.trustStatus, 'normal')
  assert.equal(summary.totalSpent, 0)
  assert.equal(summary.completedAppointments, 0)
})

test('dos no_show activan aprobación manual; rehabilitar conserva todo el historial', async () => {
  const first = await confirmed('request-first', '15:00')
  const second = await confirmed('request-second', '16:00', '+56981895314')
  outcome(first, 'no_show')
  outcome(second, 'no_show')
  const before = getClientSummary(first.customerId)
  assert.equal(before.noShows, 2)
  assert.equal(before.trustStatus, 'requires_manual_approval')
  assert.equal(setClientTrustStatus(first.customerId, 'normal').success, true)
  const after = getClientSummary(first.customerId)
  assert.equal(after.trustStatus, 'normal')
  assert.equal(after.noShows, 2)
  assert.deepEqual(after.history, before.history)
  assert.equal(outcome(second, 'no_show').changed, false)
  assert.equal(getClientSummary(first.customerId).trustStatus, 'normal')
  const third = await confirmed('request-third', '17:00')
  outcome(third, 'no_show')
  assert.equal(getClientSummary(first.customerId).trustStatus, 'requires_manual_approval')
})

test('cliente con aprobación manual puede solicitar y ser confirmado por el profesional', async () => {
  const first = await confirmed('request-first', '15:00')
  setClientTrustStatus(first.customerId, 'requires_manual_approval')
  const second = await request('request-second', '16:00')
  assert.equal(second.success, true)
  assert.equal(second.booking.status, 'pending')
  assert.equal(acceptRequest(second.booking.id).success, true)
})

test('rechazada no crea atención, historial, gasto ni no_show', async () => {
  const created = await request()
  assert.equal(updateBookingStatus(created.booking.id, 'rejected').success, true)
  assert.equal(acceptRequest(created.booking.id).success, false)
  const summary = getClientSummary(created.booking.customerId)
  assert.deepEqual(summary.history, [])
  assert.equal(summary.totalAppointments, 0)
  assert.equal(summary.totalSpent, 0)
  assert.equal(summary.noShows, 0)
})

test('aceptar una solicitud no transforma las demás del mismo horario', async () => {
  const first = await request('request-first')
  const second = await request('request-second', '15:00', '12345678')
  acceptRequest(first.booking.id)
  assert.equal(acceptRequest(second.booking.id).success, false)
  assert.equal(getRequestsSnapshot().find((record) => record.id === second.booking.id).status, 'pending')
  assert.equal(getClientHistory(second.booking.customerId).length, 0)
})

test('resultados finales mutuamente excluyentes y no permiten editar una atención cerrada', async () => {
  const booking = await confirmed()
  outcome(booking, 'completed')
  assert.equal(outcome(booking, 'cancelled').success, false)
  assert.equal(outcome(booking, 'no_show').success, false)
  assert.equal(updateBookingDetails(booking.id, { duration: 60 }).success, false)
  assert.equal(updateBookingStatus(booking.id, 'pending').success, false)
  assert.equal(getClientHistory(booking.customerId).length, 1)
})

test('precio de la reserva es snapshot del servicio, no del catálogo posterior', async () => {
  const created = await request()
  const services = await getServices()
  services.find((service) => service.id === 'haircut').price = 18000
  assert.equal((await saveServices(services)).success, true)
  const accepted = acceptRequest(created.booking.id)
  assert.equal(accepted.booking.price, 12000)
  outcome(accepted.booking, 'completed')
  assert.equal(getClientSummary(created.booking.customerId).totalSpent, 12000)
})

test('deshacer cancelación existente revierte historial sin duplicados', async () => {
  const booking = await confirmed()
  const cancelled = updateBookingStatus(booking.id, 'cancelled')
  assert.equal(getClientHistory(booking.customerId).length, 1)
  assert.equal(undoBookingChange(cancelled.undoToken).success, true)
  assert.equal(getClientHistory(booking.customerId).length, 0)
  assert.equal(getRequestsSnapshot().find((record) => record.id === booking.id).status, 'confirmed')
  assert.equal(undoBookingChange(cancelled.undoToken).success, false)
})

test('bloqueos y ocupación efectiva se respetan también al enviar y aceptar', async () => {
  const pending = await request()
  assert.equal(blockTimeSlot(dateId, '16:00').success, true)
  assert.equal((await request('request-blocked', '16:00')).success, false)
  acceptRequest(pending.booking.id)
  assert.equal((await request('request-confirmed', '15:00')).success, false)
  outcome({ ...pending.booking, appointmentId: `appointment-${pending.booking.id}` }, 'completed')
  const slot = getEffectiveTimeSlotsForDate(dateId).find((item) => item.time === '15:00')
  assert.equal(slot.status, 'completed')
  assert.equal(slot.bookingStatus, 'confirmed')
  assert.equal(slot.isBookable, false)
  assert.equal(slot.action, null)
})

test('persistencia conserva registros e identidades y no depende de contadores mock', async () => {
  storage.set('barberbook:profile:v1', 'no tocar')
  const booking = await confirmed()
  outcome(booking, 'completed')
  const stored = JSON.parse(storage.get(BOOKINGS_STORAGE_KEY))
  assert.equal(stored.version, 1)
  assert.equal(stored.records.find((record) => record.id === booking.id).status, 'completed')
  assert.equal(storage.get('barberbook:profile:v1'), 'no tocar')
  const summary = getClientSummary('client-001')
  assert.equal(summary.completedAppointments, summary.history.filter((entry) => entry.outcome === 'completed').length)
  assert.equal(summary.totalSpent, 0)
})

test('fallo de guardado no deja resultados ni trust status parcialmente actualizados', async () => {
  const first = await confirmed('request-first', '15:00')
  const second = await confirmed('request-second', '16:00')
  outcome(first, 'no_show')
  const before = storage.get(BOOKINGS_STORAGE_KEY)
  window.localStorage.setItem = () => { throw new Error('Sin espacio') }
  assert.equal(outcome(second, 'no_show').success, false)
  assert.equal(storage.get(BOOKINGS_STORAGE_KEY), before)
  assert.equal(getClientSummary(first.customerId).trustStatus, 'normal')
  assert.equal(getClientSummary(first.customerId).noShows, 1)
})

test('datos corruptos o versión desconocida no se sobrescriben', async () => {
  for (const raw of ['{', 'null', '{"version":99}', '{"version":1,"records":[]}']) {
    storage.set(BOOKINGS_STORAGE_KEY, raw)
    assert.equal(getRequestsSnapshot().length > 0, true)
    assert.equal((await request()).success, false)
    assert.equal(storage.get(BOOKINGS_STORAGE_KEY), raw)
  }
})

test('fechas persistidas no se mueven y una atención anterior queda accesible para cerrarla', async () => {
  const booking = await confirmed()
  assert.equal(getUnfinishedAppointmentDates(new Date('2030-01-08T09:00:00')).includes(dateId), true)
  assert.equal(getRequestsSnapshot().find((record) => record.id === booking.id).dateId, dateId)
  outcome(booking, 'completed')
  assert.equal(getUnfinishedAppointmentDates(new Date('2030-01-08T09:00:00')).includes(dateId), false)
})
