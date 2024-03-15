import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import '../style/Nav.css'

const NavUser = (): React.ReactElement => {
  const { isAuthenticated, isLoading, loginWithRedirect, user, logout } = useAuth0()
  return (
    <div className='nav-post'>
      {
        isAuthenticated
          ? <span className='user-info'>
            <div className='profile-pic'>
              <img src={user?.picture} alt='' />
            </div>
            <div className='side-info'>
              <Link to='/profile'>{user?.name}</Link>
              <p id='logout' onClick={(_) => {
                logout()
                  .then(r => { console.log(r) })
                  .catch(e => { console.log(e) })
              }}>Logout</p>
            </div>
          </span>
          : isLoading // Provide an expression for the isLoading condition
            ? <span className='user-info'>
              <div className='profile-pic'>
                <img src='/assets/placeholder.jpg' alt='' />
              </div>
              <div className='side-info'>
                <p className='loading nav'></p>
                <p className='loading nav smaller'></p>
              </div>
            </span>
            : <button className='nav-button'
              onClick={(_) => {
                loginWithRedirect({
                  authorizationParams: {
                    scope: 'openid profile email'
                  }
                })
                  .then(r => { console.log(r) })
                  .catch(e => { console.log(e) })
              }}>Login</button>
      }
    </div>
  )
}

export default NavUser
