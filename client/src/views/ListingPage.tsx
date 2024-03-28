import React from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import '../style/ListingPage.css'

const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg'

export interface ListingProps {
  id: number
  title: string
  userID: number
  adType: string
  imgPaths: string[]
  description: string
  location: string
  categories: string[]
  price: number
  postDate: string
  daysAgo?: string
}

const ListingPage: React.FC<ListingProps> = ({ title, adType, userID, imgPaths, description, location, categories, price, postDate, daysAgo }): React.ReactElement => {
  const { isAuthenticated } = useAuth0()

  return (
    <div className='App'>
        <header className='App-header'>
            <Nav />
            <p id='breadcrumbs'> <Link id='back-to' to='/'>Home</Link> <FontAwesomeIcon icon={faChevronRight} /> {categories} <FontAwesomeIcon icon={faChevronRight} /> {title}</p>
            <div className='content-listing'>
                <div className='content-listing-child top'>
                    <div className='content-listing-child top-left'>
                        <h1 id='title'>{title}</h1>
                        <p id='price'>${price}</p>
                    </div>
                    <div className='content-listing-child top-right'>
                        <div className='content-listing-child-icon-container left'>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <div className='content-listing-child-icon-container right'>
                            <p id='date'>{parseInt(daysAgo ?? '0')} {parseInt(daysAgo ?? '0') !== 1 ? 'days' : 'day'} ago ({adType})</p>
                            <p id='location'>
                                {location}
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className='map'>
                                (View Map)
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='content-listing-child-information'>
                    <div className='content-listing-child left'>
                        <div className='img-container'>
                            {(imgPaths[0] !== undefined)
                              ? (<img id='main' src={imgPaths[0]} alt='ad' />)
                              : (<img id='main' src={PLACEHOLDER_IMAGE} alt='ad' />)}
                            <div className='other-images'>
                                {(imgPaths[1] !== undefined)
                                  ? (<img src={imgPaths[3]} alt='ad' />)
                                  : (<img src={PLACEHOLDER_IMAGE} alt='ad' />)}
                                {(imgPaths[2] !== undefined)
                                  ? (<img src={imgPaths[3]} alt='ad' />)
                                  : (<img src={PLACEHOLDER_IMAGE} alt='ad' />)}
                                {(imgPaths[3] !== undefined)
                                  ? (<img src={imgPaths[3]} alt='ad' />)
                                  : (<img src={PLACEHOLDER_IMAGE} alt='ad' />)}
                            </div>

                        </div>
                        <h3>Description</h3>
                        <p id='description'>{description}</p>
                    </div>
                    <div className='content-listing-child right'>
                        <div className='inner-content'>
                            <p id='contact-name'>Contact {userID}</p>
                            <button id='contact'>
                                {
                                    isAuthenticated
                                      ? 'Send Message'
                                      : 'Log In to Message'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
  )
}

export default ListingPage
