import { useState } from 'react'
import {
  BOOKING_HORIZON_OPTIONS,
  getReservationPreferences,
  MINIMUM_ADVANCE_OPTIONS,
  REQUEST_EXPIRATION_OPTIONS,
  saveReservationPreferences,
} from '../../services/reservationPreferencesService.js'

const expirationLabels = { 15: '15 minutos', 30: '30 minutos', 60: '60 minutos', none: 'Sin vencimiento' }
const advanceLabels = { 0: 'Sin restricción adicional', 30: '30 minutos', 60: '1 hora', 120: '2 horas' }

function ReservationSettings({ onBack }) {
  const [savedPreferences, setSavedPreferences] = useState(getReservationPreferences)
  const [preferences, setPreferences] = useState(savedPreferences)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences)

  const update = (field, value) => {
    setPreferences((current) => ({ ...current, [field]: value }))
    setFeedback(null)
    setError(null)
  }

  const save = (event) => {
    event.preventDefault()
    const result = saveReservationPreferences(preferences)
    if (!result.success) {
      setError('Revisa los valores antes de guardar la configuración.')
      return
    }
    setPreferences(result.preferences)
    setSavedPreferences(result.preferences)
    setFeedback('Configuración de reservas actualizada.')
  }

  return (
    <div className="admin-page settings-page settings-subview reservation-settings-page">
      <button className="settings-subview__back" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Volver a Ajustes
      </button>
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Reglas de reserva</p>
          <h1>Reservas</h1>
          <p>Define cómo quieres recibir y gestionar nuevas reservas.</p>
        </div>
      </header>

      <form className="reservation-settings" onSubmit={save}>
        <section className="reservation-settings__section" aria-labelledby="confirmation-title">
          <header><span>01</span><div><h2 id="confirmation-title">Confirmación</h2>
            <p>Elige un modo global para todos tus servicios.</p></div></header>
          <fieldset className="reservation-mode-options">
            <legend>Modo de confirmación</legend>
            <label className={preferences.confirmationMode === 'manual' ? 'is-selected' : ''}>
              <input type="radio" name="confirmation-mode" value="manual"
                checked={preferences.confirmationMode === 'manual'}
                onChange={() => update('confirmationMode', 'manual')} />
              <span><strong>Manual</strong><small>Cada solicitud necesita tu aprobación antes de confirmarse.</small></span>
            </label>
            <label className={preferences.confirmationMode === 'automatic' ? 'is-selected' : ''}>
              <input type="radio" name="confirmation-mode" value="automatic"
                checked={preferences.confirmationMode === 'automatic'}
                onChange={() => update('confirmationMode', 'automatic')} />
              <span><strong>Automática</strong><small>Confirma si la hora sigue libre y el cliente no requiere aprobación manual.</small></span>
            </label>
          </fieldset>
          {preferences.confirmationMode === 'automatic' && (
            <p className="reservation-settings__info">Los clientes con restricción siempre quedarán pendientes para tu revisión.</p>
          )}
        </section>

        <section className="reservation-settings__section" aria-labelledby="manual-requests-title">
          <header><span>02</span><div><h2 id="manual-requests-title">Solicitudes manuales</h2>
            <p>Controla cuánto tiempo compiten por una hora.</p></div></header>
          <label className="reservation-field">
            <span>Tiempo para responder una solicitud</span>
            <select value={preferences.requestExpirationMinutes ?? 'none'}
              onChange={(event) => update('requestExpirationMinutes',
                event.target.value === 'none' ? null : Number(event.target.value))}>
              {REQUEST_EXPIRATION_OPTIONS.map((minutes) => (
                <option value={minutes ?? 'none'} key={minutes ?? 'none'}>
                  {expirationLabels[minutes ?? 'none']}
                </option>
              ))}
            </select>
            <small>Solo aplica a nuevas solicitudes creadas en modo Manual.</small>
          </label>
        </section>

        <section className="reservation-settings__section" aria-labelledby="cancellation-title">
          <header><span>03</span><div><h2 id="cancellation-title">Cancelación</h2>
            <p>Diferencia cancelaciones normales de las tardías.</p></div></header>
          <label className="reservation-field">
            <span>Cancelación sin penalización hasta</span>
            <span className="reservation-number-field">
              <input type="number" min="0" max="10080" step="5" required
                value={preferences.cancellationNoticeMinutes}
                onChange={(event) => update('cancellationNoticeMinutes', Number(event.target.value))} />
              <small>minutos antes</small>
            </span>
            <small>Después del plazo se registra como cancelación tardía, nunca como inasistencia.</small>
          </label>
        </section>

        <section className="reservation-settings__section" aria-labelledby="booking-window-title">
          <header><span>04</span><div><h2 id="booking-window-title">Cuándo pueden reservar</h2>
            <p>Define anticipación y horizonte del calendario público.</p></div></header>
          <div className="reservation-settings__fields">
            <label className="reservation-field">
              <span>Anticipación mínima</span>
              <select value={preferences.minimumAdvanceMinutes}
                onChange={(event) => update('minimumAdvanceMinutes', Number(event.target.value))}>
                {MINIMUM_ADVANCE_OPTIONS.map((minutes) => (
                  <option value={minutes} key={minutes}>{advanceLabels[minutes]}</option>
                ))}
              </select>
            </label>
            <label className="reservation-field">
              <span>Días disponibles hacia adelante</span>
              <select value={preferences.bookingHorizonDays}
                onChange={(event) => update('bookingHorizonDays', Number(event.target.value))}>
                {BOOKING_HORIZON_OPTIONS.map((days) => (
                  <option value={days} key={days}>{days} días</option>
                ))}
              </select>
              <small>Agenda profesional mantiene su navegación habitual.</small>
            </label>
          </div>
        </section>

        <footer className="reservation-settings__actions">
          <div aria-live="polite">
            {error && <p data-type="error">{error}</p>}
            {feedback && <p data-type="success">{feedback}</p>}
          </div>
          <button className="button button--secondary" type="button" disabled={!hasChanges}
            onClick={() => { setPreferences(savedPreferences); setError(null); setFeedback(null) }}>
            Descartar cambios
          </button>
          <button className="button button--primary" type="submit" disabled={!hasChanges}>Guardar cambios</button>
        </footer>
      </form>
    </div>
  )
}

export default ReservationSettings
