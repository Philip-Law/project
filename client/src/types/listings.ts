export interface ListingInfo {
  id: number
  title: string
  adType: string
  description: string
  location: string
  categories: string[]
  price: string
  postDate: string
}

export const convertType = async (input: string): Promise<string> => {
  if (input === 'W') {
    return 'Wanted'
  } else if (input === 'A') {
    return 'Academic Service'
  } else {
    return 'Selling'
  }
}
