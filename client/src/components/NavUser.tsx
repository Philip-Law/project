import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import '../style/Nav.css'

const NavUser = (): React.ReactElement => {
  const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0()

  return (
        <div className='nav-user'>
            {
                isAuthenticated
                  ? <span className='user-info'>
                        <div className='profile-pic'>
                            <img src={user?.picture} alt='' />
                        </div>
                        <div className='side-info'>
                            <p>{user?.name}</p>
                            <p id='logout' onClick={(_) => {
                              logout()
                                .then(r => { console.log(r) })
                                .catch(e => { console.log(e) })
                            }}>Logout</p>
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
