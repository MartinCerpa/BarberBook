import { initialRequests } from '../data/requests.js'

const initialCustomers = initialRequests.reduce((customers, request) => {
  if (customers.some((customer) => customer.phone === request.phone)) {
    return customers
  }

  return [
    ...customers,
    {
      id: `customer-${request.id.replace('request-', '')}`,
      name: request.customerName,
      phone: request.phone,
      email: '',
    },
  ]
}, [])

const copyCustomer = (customer) => ({ ...customer })

let customers = initialCustomers.map(copyCustomer)
let customerSequence = customers.length

export const getCustomers = async () => customers.map(copyCustomer)

export const getCustomerById = async (customerId) => {
  const customer = customers.find((item) => item.id === customerId)
  return customer ? copyCustomer(customer) : null
}

export const createCustomer = async (customerData) => {
  customerSequence += 1
  const customer = {
    email: '',
    ...customerData,
    id:
      customerData.id ??
      `customer-${String(customerSequence).padStart(3, '0')}`,
  }

  customers = [...customers, customer]
  return copyCustomer(customer)
}

export const customerService = {
  getCustomers,
  getCustomerById,
  createCustomer,
}
