import React, { useCallback, useEffect, useState } from 'react'
import Nav from './Nav'
import '../style/Profile.css'
import Listings from '../components/Listings'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const Profile = (): React.ReactElement => {
  const { user, isLoading, getAccessTokenSilently } = useAuth0()
  const [isFirstTime, setIsFirstTime] = useState(false)
  if (isLoading) {
    return (
      <div className='App'>
        <header className='App-header'>
          <Nav />
          <div className='content profile'>
            <div className='container profile'>
              <div className='profile-information'>
                <div className='top-row'>
                  <div className='left'>
                    <h2>Profile Information</h2>
                    <p>Personalize your profile here.</p>
                  </div>
                  <div className='right'>
                    <FontAwesomeIcon icon={faEdit} />
                  </div>
                </div>
                <img src={'/assets/placeholder.jpg'} alt={'placeholder imag'} />
                <div className='profile-info'>
                  <h3 className='loading'></h3>
                  <p className='loading p'></p>
                </div>
              </div>
            </div>
            <Listings response={[]} />
          </div>
        </header>
      </div>
    )
  }

  const healthCheck = useCallback(async () => {
    let token
    try {
      token = await getAccessTokenSilently()
    } catch (e) {
      console.log(e)
      return
    }
    const response = await fetch(`http://localhost:8080/user/${user?.sub}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 404) {
      setIsFirstTime(true)
    } else {
      setIsFirstTime(false)
    }
  }, [user])

  useEffect(() => {
    void healthCheck()
  }, [healthCheck])

  return (
    <div className='App'>
      <header className='App-header'>
        <Nav />
        <div className='content profile'>
          <div className='container profile'>
            <div className='profile-information'>
              <div className='top-row'>
                <div className='left'>
                  <h2>Profile Information</h2>
                  <p>Personalize your profile here.</p>
                </div>
                <div className='right'>
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              </div>
              {
                isFirstTime
                  ? <div className='first-time'>
                    <div className='left'>
                      <FontAwesomeIcon icon={faInfoCircle} bounce className='first-time-icon' />
                    </div>
                    <div className='right'>
                      <h5>Welcome to TMU Connect</h5>
                      <p>{'It looks like this is your first time here. For full access, click here to setup your account.'}</p>
                    </div>
                  </div>
                  : null
              }
              <img src={user?.picture} alt={user?.name} />
              <div className='profile-info'>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
              <div className='more-about-profile'>
                <p><strong>1st Year:</strong> Aerospace Engineering</p>
              </div>
            </div>
          </div>
          <Listings response={[]} />
        </div>
      </header>
    </div>
  )
}

export default withAuthenticationRequired(Profile, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (
    <div className='App'>
      <header className='App-header'>
        <Nav />
        <div className='content profile'>
          <div className='container profile'>
            <div className='profile-information'>
              <div className='top-row'>
                <div className='left'>
                  <h2>Profile Information</h2>
                  <p>Personalize your profile here.</p>
                </div>
                <div className='right'>
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              </div>
              <img src={'/assets/placeholder.jpg'} alt={'placeholder imag'} />
              <div className='profile-info'>
                <h3 className='loading'></h3>
                <p className='loading p'></p>
              </div>
            </div>
          </div>
          <Listings response={[]} />
        </div>
      </header>
    </div>
  )
})
