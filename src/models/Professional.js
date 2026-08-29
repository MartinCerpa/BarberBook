/**
 * Professional responsible for providing bookable services.
 */
export class Professional {
  constructor({ id = null, businessId = null, name = '', role = '', bio = '' } = {}) {
    this.id = id
    this.businessId = businessId
    this.name = name
    this.role = role
    this.bio = bio
  }
}
