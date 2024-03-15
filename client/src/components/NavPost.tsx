import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

const NavPost = (): React.ReactElement => {
  const { isAuthenticated, isLoading, loginWithRedirect, user, logout } = useAuth0()
  return (
    <div className='nav-user'>
      {/* isAuthenticated dictates whether the 'Post Ad' button allows a post or redirects to login */}
      {isAuthenticated ? (
        <Link to="/postad" className='nav-button'>Post Ad</Link>
      ) : (
        <button className='nav-button' onClick={() => {
          loginWithRedirect({
            authorizationParams: {
              scope: 'openid profile email'
            }
          })
          .then(r => { console.log(r) })
          .catch(e => { console.log(e) })
        }}>Post Ad</button>
      )}
    </div>
  )
}

export default NavPost
