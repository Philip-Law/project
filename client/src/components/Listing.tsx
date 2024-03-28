import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/Listings.css'
import type { ListingProps } from '../views/ListingPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

function calculateDaysAgo (dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays.toString()
}

const Listing: React.FC<ListingProps> = ({ id, title, adType, userID, imgPaths, description, location, categories, price, postDate }): React.ReactElement => {
  const navigate = useNavigate()
  const daysAgo = calculateDaysAgo(postDate).toString()
  const handleListingClick = (): void => {
    navigate(`/listing/${id}`)
  }

  return (
      <div className='listing' onClick={handleListingClick}>
        <div id='img-container'>
            <img src={`${imgPaths[0]}`} alt='ad' />
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
                <p>{parseInt(daysAgo)} {parseInt(daysAgo) !== 1 ? 'days' : 'day'} ago</p>
                <p>|</p>
                <p>{adType}</p>
            </div>
        </div>
      </div>
  )
}

export default Listing
