import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './views/Home'
import NotFound from './views/NotFound'
import { Auth0Provider } from '@auth0/auth0-react'
import Profile from './views/Profile'

const App = (): React.ReactElement => {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/profile', element: <Profile /> },
    { path: '*', element: <NotFound /> }
  ])

  const domain = process.env.REACT_APP_DOMAIN ?? ''
  const clientId = process.env.REACT_APP_CLIENT_ID ?? ''

  return (
      <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: 'http://localhost:3000/profile',
            scope: 'openid profile email read:message',
            audience: process.env.REACT_APP_BACKEND_AUDIENCE
          }}
      >
          <RouterProvider router={router} />
      </Auth0Provider>

  )
}

export default App
