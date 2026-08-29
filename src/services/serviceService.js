import { services } from '../data/services.js'

const copyService = (service) => ({ ...service })

export const getServices = async () => services.map(copyService)

export const getServiceById = async (serviceId) => {
  const service = services.find((item) => item.id === serviceId)
  return service ? copyService(service) : null
}

export const serviceService = {
  getServices,
  getServiceById,
}
