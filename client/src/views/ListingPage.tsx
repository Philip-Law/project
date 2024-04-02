import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  userName: string
  adType: string
  imgPaths: string[]
  description: string
  location: string
  categories: string[]
  price: number
  postDate: string
  daysAgo?: string
}

const ListingPage: React.FC<ListingProps> = ({
  id, title, adType, userID, userName, imgPaths, description,
  location, categories, price, daysAgo
}: ListingProps): React.ReactElement => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const categoriesString = categories.join(', ')
  const navigate = useNavigate()

  const handleContact = async (): Promise<void> => {
    if (!isAuthenticated) {
      console.log('Please log in to message another user.')
    }
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`http://localhost:8080/conversation/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.log('Response error status: ', response.status)
      }
      navigate('/conversations', { state: { userID } })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='App'>
        <header className='App-header'>
            <Nav />
            <p className='breadcrumb-listings'> <Link id='back-to' to='/'>Home</Link> <FontAwesomeIcon icon={faChevronRight} /> {adType} <FontAwesomeIcon icon={faChevronRight} /> {title}</p>
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
                                  ? (<img src={imgPaths[1]} alt='ad' />)
                                  : (<img src={PLACEHOLDER_IMAGE} alt='ad' />)}
                                {(imgPaths[2] !== undefined)
                                  ? (<img src={imgPaths[2]} alt='ad' />)
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
                            <p id='contact-name'>Contact {userName}</p>
                            <button id='contact' onClick={() => { handleContact().catch(error => { console.log(error) }) }}>
                                {
                                    isAuthenticated
                                      ? 'Send Message'
                                      : 'Log In to Message'
                                }
                            </button>
                        </div>
                        <div className='inner-content'>
                            <h4 style={{ margin: '0', textDecoration: 'underline' }}>Categories</h4>
                            <p>{categoriesString}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
  )
}

export default ListingPage
