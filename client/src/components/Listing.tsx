import React from 'react'
import '../style/Listings.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

interface ListingProps {
  title: string
  adType: number
  imgPath: string
  description: string
  location: string
  categories: string
  price: number
  postDate: string
}

function calculateDaysAgo (dateString: string): number {
  const currentDate = new Date()
  const parts = dateString.split('-')
  const givenYear = parseInt(parts[0], 10)
  const givenMonth = parseInt(parts[1], 10) - 1 // Adjust month to be zero-indexed
  const givenDay = parseInt(parts[2], 10)

  const givenDate = new Date(givenYear, givenMonth, givenDay)

  // Calculate the difference in milliseconds
  const differenceInMs = currentDate.getTime() - givenDate.getTime()

  // Convert milliseconds to days
  const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24))

  return daysAgo
}

const Listing: React.FC<ListingProps> = ({ title, adType, imgPath, description, location, categories, price, postDate }): React.ReactElement => {
  const daysAgo = calculateDaysAgo(postDate)
  return (
      <div className='listing'>
        <div className='img-container'>
            <img src={`${imgPath}`} alt='ad' />
        </div>
        <div className='ad-content'>
            <div className='top'>
                <p id='price'>${price % 1 !== 0 ? price.toFixed(2) : price + '.00'}</p>
                <h3>{title}</h3>
                <div className='sub-info'>
                    <p>{location}</p>
                    <p>|</p>
                    <p>{categories}</p>
                </div>
                <p id='description'>{description}</p>
            </div>
            <div className='post-info'>
                <FontAwesomeIcon icon={faClock} />
                <p>{daysAgo} {daysAgo > 1 ? 'days' : 'day'} ago</p>
                <p>|</p>
                <p>{adType === 1 ? 'For Sale' : 'For Rent'}</p>
            </div>
        </div>
      </div>
  )
}

export default Listing
