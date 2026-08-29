import { business } from '../data/business.js'
import { professional } from '../data/professional.js'

const copyBusiness = () => ({
  ...business,
  openingHours: { ...business.openingHours },
})

const copyProfessional = () => ({ ...professional })

export const getBusiness = async () => copyBusiness()

export const getProfessional = async () => copyProfessional()

export const getPublicProfile = async () => ({
  business: copyBusiness(),
  professional: copyProfessional(),
})

export const professionalService = {
  getBusiness,
  getProfessional,
  getPublicProfile,
}
