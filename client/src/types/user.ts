import type { ListingInfo } from './listings'

export interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  picture: string
  major: string
  year: number
  phoneNumber: string
  name?: string
}

export interface DetailedListing extends ListingInfo {
  user: UserInfo
}
