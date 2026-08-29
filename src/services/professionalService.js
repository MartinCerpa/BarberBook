import { business } from '../data/business.js'
import { professional } from '../data/professional.js'

const copyBusiness = () => ({
  ...business,
  openingHours: { ...business.openingHours },
})

const copyProfessional = (value = professional) => ({
  ...value,
  specialties: [...value.specialties],
})

export const getBusiness = async () => copyBusiness()

export const getProfessional = async () => copyProfessional()

export const getProfessionalBySlug = async (slug) => {
  if (professional.slug !== slug) {
    return null
  }

  return copyProfessional()
}

export const getPublicProfile = async () => ({
  business: copyBusiness(),
  professional: copyProfessional(),
})

export const professionalService = {
  getBusiness,
  getProfessional,
  getProfessionalBySlug,
  getPublicProfile,
}