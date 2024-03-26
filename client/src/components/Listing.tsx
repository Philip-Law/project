import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/Listings.css'
import type { ListingProps } from '../views/ListingPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

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

const Listing: React.FC<ListingProps> = ({ title, adType, userID, imgPaths, description, location, categories, price, postDate }): React.ReactElement => {
  const navigate = useNavigate()
  const daysAgo = calculateDaysAgo(postDate).toString()
  const handleListingClick = (): void => {
    navigate('/listing', { state: { title, adType, userID, imgPaths, description, location, categories, price, daysAgo } })
  }
  return (
      <div className='listing' onClick={handleListingClick}>
        <div id='img-container'>
            <img src={`${imgPaths}`} alt='ad' />
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
                <p>{parseInt(daysAgo)} {parseInt(daysAgo) > 1 ? 'days' : 'day'} ago</p>
                <p>|</p>
                <p>{adType === 1 ? 'For Sale' : 'For Rent'}</p>
            </div>
        </div>
      </div>
  )
}

export default Listing
