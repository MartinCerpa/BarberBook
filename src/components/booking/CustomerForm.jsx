import { useState } from 'react'

const validateCustomer = ({ name, phone }) => {
  const errors = {}
  const phoneDigits = phone.replace(/\D/g, '')
  const isChileanMobile =
    (phoneDigits.length === 9 && phoneDigits.startsWith('9')) ||
    (phoneDigits.length === 11 && phoneDigits.startsWith('569'))

  if (name.trim().length < 2) {
    errors.name = 'Ingresa un nombre de al menos 2 caracteres.'
  }

  if (!isChileanMobile) {
    errors.phone = 'Ingresa un celular chileno válido, por ejemplo +56 9 1234 5678.'
  }

  return errors
}

function CustomerForm({ customer, onChange, onBack, onNext }) {
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    onChange({ ...customer, [field]: value })

    if (errors[field]) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateCustomer(customer)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onNext()
  }

  return (
    <form className="booking-step customer-form" onSubmit={handleSubmit} noValidate>
      <div className="booking-step__heading">
        <p className="eyebrow">Paso 4</p>
        <h1>Tus datos de contacto</h1>
        <p>Solo los usaremos para identificar esta solicitud.</p>
      </div>

      <div className="form-field">
        <label htmlFor="customer-name">Nombre</label>
        <input
          id="customer-name"
          name="name"
          type="text"
          autoComplete="name"
          value={customer.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Ej. Camila Soto"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'customer-name-error' : undefined}
        />
        {errors.name && (
          <span className="form-error" id="customer-name-error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="customer-phone">Teléfono</label>
        <input
          id="customer-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={customer.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          placeholder="+56 9 1234 5678"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'customer-phone-error' : 'customer-phone-help'}
        />
        <span className="form-help" id="customer-phone-help">
          Puedes escribirlo con o sin espacios.
        </span>
        {errors.phone && (
          <span className="form-error" id="customer-phone-error" role="alert">
            {errors.phone}
          </span>
        )}
      </div>

      <div className="booking-actions">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Volver
        </button>
        <button className="button button--primary" type="submit">
          Revisar solicitud
        </button>
      </div>
    </form>
  )
}

export default CustomerForm
