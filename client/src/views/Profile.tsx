import React, { useCallback, useEffect } from 'react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'

const Profile = (): React.ReactElement => {
  const { user, isLoading, getAccessTokenSilently } = useAuth0()

  if (isLoading) {
    return <div>Loading ...</div>
  }

  const healthCheck = useCallback(async () => {
    let token
    try {
      token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_BACKEND_AUDIENCE,
          scope: 'read:message'
        }
      })
    } catch (e) {
      console.log(e)
      return
    }

    console.log(token)
    const response = await fetch('http://localhost:8080/health', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response)
  }, [user])

  useEffect(() => {
    void healthCheck()
  }, [healthCheck])

  return (
    <div>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  )
}

export default withAuthenticationRequired(Profile, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<div>Redirecting you to the login page...</div>)
})
