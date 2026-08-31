import { useState } from 'react'
import { getDefaultWeeklyHours, WEEK_DAYS } from '../../data/availability.js'
import {
  getWorkingHours,
  MAX_DAILY_INTERVALS,
  saveWorkingHours,
} from '../../services/workingHoursPreferencesService.js'

function WorkingHoursSettings({ onBack }) {
  const [savedHours, setSavedHours] = useState(getWorkingHours)
  const [hours, setHours] = useState(savedHours)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const hasChanges = JSON.stringify(hours) !== JSON.stringify(savedHours)

  const updateDay = (dayId, update) => {
    setHours((current) => ({
      ...current,
      days: current.days.map((day) => day.day === dayId ? update(day) : day),
    }))
    setErrors((current) => ({ ...current, [dayId]: null }))
    setFeedback(null)
  }

  const toggleDay = (dayId) => updateDay(dayId, (day) => {
    const defaults = getDefaultWeeklyHours().days.find((item) => item.day === dayId)
    return {
      ...day,
      enabled: !day.enabled,
      intervals: day.intervals.length ? day.intervals : defaults.intervals.length
        ? defaults.intervals : [{ start: '10:00', end: '13:00' }],
    }
  })

  const updateInterval = (dayId, index, field, value) => updateDay(dayId, (day) => ({
    ...day,
    intervals: day.intervals.map((interval, i) => i === index
      ? { ...interval, [field]: value } : interval),
  }))

  const save = (event) => {
    event.preventDefault()
    const result = saveWorkingHours(hours)
    if (!result.success) {
      setErrors(result.errors)
      setFeedback({ type: 'error', message: Object.keys(result.errors).length
        ? 'Revisa los intervalos indicados antes de guardar.'
        : 'No pudimos guardar los horarios en este navegador.' })
      return
    }
    setHours(result.hours)
    setSavedHours(result.hours)
    setErrors({})
    setFeedback({ type: 'success', message: 'Horarios guardados. Agenda y reservas ya usan esta configuración.' })
  }

  return (
    <div className="admin-page settings-page settings-subview working-hours-page">
      <button className="settings-subview__back" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Volver a Ajustes
      </button>
      <header className="admin-page__heading">
        <div>
          <p className="eyebrow">Tu semana habitual</p>
          <h1>Horarios de atención</h1>
          <p>Define cuándo trabajas. Las excepciones de una fecha se gestionan desde Agenda.</p>
        </div>
      </header>
      <form className="working-hours" onSubmit={save}>
        <p className="working-hours__note">Las horas de inicio se ofrecen cada 60 minutos. La hora de término no se ofrece como inicio.</p>
        <div className="working-hours__days">
          {WEEK_DAYS.map(({ day: dayId, label }) => {
            const day = hours.days.find((item) => item.day === dayId)
            return (
              <section className="working-hours__day" aria-labelledby={`working-day-${dayId}`} key={dayId}>
                <header>
                  <h2 id={`working-day-${dayId}`}>{label}</h2>
                  <button type="button" className="working-hours__toggle" role="switch"
                    aria-checked={day.enabled} aria-label={`${label} activo`}
                    onClick={() => toggleDay(dayId)}>
                    <span aria-hidden="true" />{day.enabled ? 'Activo' : 'Cerrado'}
                  </button>
                </header>
                {day.enabled ? (
                  <>
                    <div className="working-hours__intervals">
                      {day.intervals.map((interval, index) => (
                        <div className="working-hours__interval" key={index}>
                          <label>
                            <span>Desde</span>
                            <input type="time" step="60" required value={interval.start}
                              aria-label={`${label}, inicio ${index + 1}`}
                              aria-invalid={Boolean(errors[dayId])}
                              aria-describedby={errors[dayId] ? `hours-error-${dayId}` : undefined}
                              onInput={(event) => updateInterval(dayId, index, 'start', event.currentTarget.value)} />
                          </label>
                          <span className="working-hours__separator" aria-hidden="true">—</span>
                          <label>
                            <span>Hasta</span>
                            <input type="time" step="60" required value={interval.end}
                              aria-label={`${label}, término ${index + 1}`}
                              aria-invalid={Boolean(errors[dayId])}
                              aria-describedby={errors[dayId] ? `hours-error-${dayId}` : undefined}
                              onInput={(event) => updateInterval(dayId, index, 'end', event.currentTarget.value)} />
                          </label>
                          <button className="working-hours__remove" type="button"
                            aria-label={`Eliminar intervalo ${index + 1} de ${label}`}
                            disabled={day.intervals.length === 1}
                            onClick={() => updateDay(dayId, (current) => ({ ...current,
                              intervals: current.intervals.filter((_, i) => i !== index),
                            }))}>×</button>
                        </div>
                      ))}
                    </div>
                    <button className="working-hours__add" type="button"
                      disabled={day.intervals.length >= MAX_DAILY_INTERVALS}
                      onClick={() => updateDay(dayId, (current) => ({ ...current,
                        intervals: [...current.intervals, { start: '', end: '' }],
                      }))}>Agregar intervalo<span className="sr-only"> a {label}</span></button>
                  </>
                ) : <p className="working-hours__closed">No se ofrecen nuevas reservas este día.</p>}
                {errors[dayId] && <p className="working-hours__error" id={`hours-error-${dayId}`} role="alert">{errors[dayId]}</p>}
              </section>
            )
          })}
        </div>
        <footer className="working-hours__actions">
          <div aria-live="polite">
            {feedback && <p data-type={feedback.type}>{feedback.message}</p>}
          </div>
          <button className="button button--secondary" type="button" disabled={!hasChanges}
            onClick={() => { setHours(savedHours); setErrors({}); setFeedback(null) }}>Descartar cambios</button>
          <button className="button button--primary" type="submit" disabled={!hasChanges}>Guardar horarios</button>
        </footer>
      </form>
    </div>
  )
}

export default WorkingHoursSettings
