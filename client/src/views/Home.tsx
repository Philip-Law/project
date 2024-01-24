import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import '../style/Home.css'
import logo from '../assets/logo.svg'

const Home = (): React.ReactElement => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                {
                    isAuthenticated
                      ? <h2 className="App-link"
                            onClick={(_) => {
                              logout()
                                .then(r => { console.log(r) })
                                .catch(e => { console.log(e) })
                            }}
                        >Logout {user?.name}</h2>
                      : <h2 className="App-link"
                            onClick={(_) => {
                              loginWithRedirect()
                                .then(r => { console.log(r) })
                                .catch(e => { console.log(e) })
                            }}>Login</h2>
                }
            </header>
        </div>
  )
}

export default Home
