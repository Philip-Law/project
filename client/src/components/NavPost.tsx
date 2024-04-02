import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useApi } from '../context/APIContext'
import { useNavigate } from 'react-router-dom'

const NavPost = (): React.ReactElement => {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0()
  const navigate = useNavigate()
  const { sendRequest } = useApi()

  const handleClickPost = (): void => {
    if (!isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          scope: 'openid profile email'
        }
      })
        .then(r => { console.log(r) })
        .catch(e => { console.log(e) })
    } else {
      void checkUserSetup()
    }
  }

  const checkUserSetup = async (): Promise<void> => {
    try {
      const { status } = await sendRequest({
        method: 'GET',
        endpoint: `user/${user?.sub}`
      })

      if (status === 200) {
        navigate('/postad')
      } else {
        navigate('/profile')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  return (
    <div className='nav-post'>
      <div className={isLoading ? 'loading nav' : 'nav-button'} onClick={handleClickPost}>{isLoading ? '' : 'Post Ad'}</div>
    </div>
  )
}

export default NavPost
