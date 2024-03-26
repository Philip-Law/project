import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ListingPage from '../views/ListingPage'

const ListingPageWrapper: React.FC = () => {
  const [listingDetails, setDetails] = useState<any>({})
  const { id } = useParams<{ id: string }>();

  const convertType = async (input: string): Promise<string> => {
    if (input === 'W') {
      return 'Wanted'
    } else if (input === 'A') {
      return 'Academic Service'
    } else {
      return 'Selling'
    }
  }

  const getDaysAgo = async(dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const getDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post/details/${id}`, {
        method: 'GET',
      })
      if (!response.ok) {
        console.error('Details not found')
        return;
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching details:', error)
    }
  }

  const getImages = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post/image/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Images not found')
        return;
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  useEffect(() => {
    console.log(listingDetails)
  }, [listingDetails])

  useEffect(() => {
    
    const fillDetails = async() => {
      const listingD = await getDetails()
      const imageD = await getImages()

      const listingInfo = {
        title: listingD.title,
        adType: await convertType(listingD.adType),
        imgPaths: imageD,
        userID: listingD.user.id,
        description: listingD.description,
        location: listingD.location,
        categories: Array.from(listingD.categories),
        price: listingD.price,
        postDate: listingD.postDate,
        daysAgo: await getDaysAgo(listingD.postDate)
      }
      setDetails(listingInfo)
    }
    fillDetails()
  }, [])

  if (Object.keys(listingDetails).length === 0) {
    return <div>No listing details provided.</div>
  }
  return <ListingPage {...listingDetails} />
};

export default ListingPageWrapper;
