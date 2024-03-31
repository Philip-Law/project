import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ListingPage from '../views/ListingPage'

interface ListingInfo {
  id: number
  title: string
  adType: string
  imgPaths: string[]
  userID: number
  userName: string
  description: string
  location: string
  categories: string[]
  price: number
  postDate: string
  daysAgo: string
}

const ListingPageWrapper: React.FC = () => {
  const initialListingInfo: ListingInfo = {
    id: 0,
    title: '',
    adType: '',
    imgPaths: [],
    userID: 0,
    userName: '',
    description: '',
    location: '',
    categories: [],
    price: 0,
    postDate: '',
    daysAgo: ''
  }
  const [listingDetails, setDetails] = useState<ListingInfo>(initialListingInfo)
  const { id } = useParams<{ id: string }>()

  const convertType = async (input: string): Promise<string> => {
    if (input === 'W') {
      return 'Wanted'
    } else if (input === 'A') {
      return 'Academic Service'
    } else {
      return 'Selling'
    }
  }

  const getDaysAgo = async (dateString: string): Promise<string> => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays.toString()
  }

  const getDetails = async (): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:8080/post/details/${id}`, {
        method: 'GET'
      })
      if (!response.ok) {
        console.error('Details not found')
        return
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching details:', error)
    }
  }

  const getImages = async (): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:8080/post/image/${id}`, {
        method: 'GET'
      })

      if (!response.ok) {
        console.error('Images not found')
        return
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const getUserName = async (userID: string): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:8080/user/name/${userID}`, {
        method: 'GET'
      })

      if (!response.ok) {
        console.error('User not found')
        return
      }
      const jsonResponse = await response.json()
      return jsonResponse.user
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  useEffect(() => {
    const fillDetails = async (): Promise<void> => {
      const listingD = await getDetails()
      const imageD = await getImages()

      const listingInfo = {
        id: listingD.id,
        title: listingD.title,
        adType: await convertType(listingD.adType as string),
        imgPaths: imageD,
        userID: listingD.user.id,
        userName: await getUserName(listingD.user.id as string),
        description: listingD.description,
        location: listingD.location,
        categories: Array.from(listingD.categories as string),
        price: listingD.price,
        postDate: listingD.postDate,
        daysAgo: await getDaysAgo(listingD.postDate as string)
      }
      setDetails(listingInfo)
    }
    void fillDetails()
  }, [])

  if (Object.keys(listingDetails).length === 0) {
    return <div>No listing details provided.</div>
  }
  return <ListingPage {...listingDetails} />
}

export default ListingPageWrapper
