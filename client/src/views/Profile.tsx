import React, { useCallback, useEffect, useState } from 'react'
import Nav from './Nav'
import '../style/Profile.css'
import Listings from '../components/Listings'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg'

const Profile = (): React.ReactElement => {
  const { user, isLoading, getAccessTokenSilently } = useAuth0()
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userListings, setUserListings] = useState<any[]>([])
  const [profileInfo, setProfileInfo] = useState({
    phoneNumber: '',
    major: '',
    year: 1
  })
  const validateProfile = (): boolean => {
    return profileInfo.phoneNumber.length === 12 &&
    profileInfo.major.length > 0 &&
    /^\+[0-9]{10,15}$/.test(profileInfo.phoneNumber)
  }

  const formatPhoneNumber = (phoneNumber: string): string => {
    // format phone number to +1 (555) 555-5555
    if (phoneNumber.length === 11) {
      return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`
    } else {
      return phoneNumber
    }
  }

  const getToken = async (): Promise<string> => {
    return await getAccessTokenSilently()
  }

  const convertType = async (input: string): Promise<string> => {
    if (input === 'W') {
      return 'Wanted'
    } else if (input === 'A') {
      return 'Academic Service'
    } else {
      return 'Selling'
    }
  }

  const getImage = async (id: string): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:8080/post/image/${id}`, {
        method: 'GET'
      })

      if (!response.ok) {
        console.error('Images not found')
        return
      }
      const jsonResponse = await response.json()
      if (jsonResponse.length === 0) {
        return [PLACEHOLDER_IMAGE]
      } else {
        return jsonResponse
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const getUserListings = async (token: string): Promise<any> => {
    try {
      const response = await fetch('http://localhost:8080/post/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.error('Listings not found')
        return {}
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching details:', error)
    }
  }

  useEffect(() => {
    const renderPosts = async (): Promise<any> => {
      const token = await getToken()
      const posts = await getUserListings(token)

      if (posts !== undefined) {
        try {
          const newListings = await Promise.all(posts.map(async (post: any) => {
            const img = await getImage(post.id as string)
            if (img !== undefined) {
              const listingInfo = {
                id: post.id,
                title: post.title,
                adType: await convertType(post.adType as string),
                imgPaths: img,
                description: post.description,
                location: post.location,
                categories: Array.from(post.categories as string),
                price: parseFloat(post.price as string),
                postDate: post.postDate
              }

              return listingInfo
            }
          }))
          setUserListings(newListings)
        } catch {
        }
      }
    }
    void renderPosts()
  }, [])

  const toggleEditing = async (): Promise<void> => {
    const accessToken = await getToken()
    if (isEditing && isFirstTime) {
      const response = await fetch('http://localhost:8080/user/setup', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileInfo)
      })
      if (response.status === 200) {
        setIsEditing(false)
        window.location.reload()
      }
    } else if (isEditing && !isFirstTime) {
      const response = await fetch('http://localhost:8080/user/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileInfo)
      })
      if (response.status === 200) {
        setIsEditing(false)
        window.location.reload()
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleInputChange = (e: any): void => {
    const { name, value } = e.target
    setProfileInfo(prevState => ({
      ...prevState,
      [name]: name === 'year' ? Number(value) : value
    }))
  }

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
            <Listings response={[]} isProfile={false} />
          </div>
        </header>
      </div>
    )
  }

  const healthCheck = useCallback(async () => {
    const accessToken = await getToken()
    const response = await fetch(`http://localhost:8080/user/${user?.sub}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (response.status === 404) {
      setIsFirstTime(true)
    } else {
      setIsFirstTime(false)
      const data = await response.json()
      setProfileInfo({
        phoneNumber: data.phoneNumber,
        major: data.major,
        year: data.year
      })
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
                  <FontAwesomeIcon icon={faEdit} onClick={() => { toggleEditing().catch(console.error) }}/>
                </div>
              </div>
              {
                isFirstTime
                  ? <div className='first-time' onClick={() => { toggleEditing().catch(console.error) }}>
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
                {
                  isEditing
                    ? <div className='edit-profile'>
                      <h5>Account Setup</h5>
                      <label htmlFor='year'>Year</label>
                      <input type='number' name='year' placeholder='Year' min={1} max={6} value={profileInfo.year} onChange={handleInputChange} />
                      <label htmlFor='major'>Major</label>
                      <input type='text' name='major' placeholder='Major' value={profileInfo.major} onChange={handleInputChange} />
                      <label htmlFor='phoneNumber'>Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={`${profileInfo.phoneNumber.length === 0 ? '+1' : ''}${profileInfo.phoneNumber}`}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                      />
                      <button
                      className={`${validateProfile() ? 'ready' : ''}`}
                      onClick={() => {
                        if (validateProfile()) {
                          toggleEditing().catch(console.error)
                        }
                      }}>
                      Save
                      </button>
                    </div>
                    : <div className='profile-info'>
                        <div className='program-row'>
                            {
                            isFirstTime
                              ? <p>Click the <strong>prompt</strong> above to setup your account.</p>
                              : <p><strong>{profileInfo.year}{profileInfo.year > 1 ? 'nd' : 'st'} Year</strong>:</p>
                            }
                          <p>{profileInfo.major}</p>
                        </div>
                        <p>{formatPhoneNumber(profileInfo.phoneNumber)}</p>
                      </div>
                }
              </div>
            </div>
          </div>
          <Listings response={userListings} isProfile={true} />
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
          <Listings response={[]} isProfile={false} />
        </div>
      </header>
    </div>
  )
})
