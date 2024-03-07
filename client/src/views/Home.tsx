import React from 'react'
import '../style/Home.css'
import Nav from './Nav'

const Home = (): React.ReactElement => {
  return (
        <div className="App">
            <header className="App-header">
                <Nav/>
            </header>
        </div>
  )
}

export default Home
