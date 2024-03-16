import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

const NavPost = (): React.ReactElement => {
  const { isAuthenticated, isLoading, loginWithRedirect, user, logout, getAccessTokenSilently } = useAuth0()

  const handleClickPost = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          scope: 'openid profile email'
        }
      })
        .then(r => { console.log(r) })
        .catch(e => { console.log(e) })
    } else {
      checkUserSetup()
    }
  }

  const checkUserSetup = async () => {
    let token: string
    try {
      token = await getAccessTokenSilently()
    } catch (e) {
      console.log(e)
      return
    }

    try {
      fetch(`http://localhost:8080/user/${user?.sub}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = '/postad'
        } else {
          window.location.href = '/setup'
        }
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  return (
    <div className='nav-user'>
      <div className={isLoading?'loading nav':'nav-button'} onClick={handleClickPost}>{isLoading ? '' : 'Post Ad'}</div>
    </div>
  )
}

export default NavPost
