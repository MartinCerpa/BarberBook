/**
 * Service offered by a professional or business.
 */
export class Service {
  constructor({ id = '', name = '', description = '', price = 0, duration = 0 } = {}) {
    this.id = id
    this.name = name
    this.description = description
    this.price = price
    this.duration = duration
  }
}
