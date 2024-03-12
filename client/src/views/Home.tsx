import React from 'react'
import '../style/Home.css'
import Nav from './Nav'
import Filter from '../components/Filter'
import Listings from '../components/Listings'
import FilterMobile from '../components/FilterMobile'

const Home = (): React.ReactElement => {
  return (
        <div className="App">
            <header className="App-header">
                <Nav/>
                <div className='content'>
                  <Filter/>
                  <FilterMobile/>
                  <Listings/>
                </div>
            </header>
        </div>
  )
}

export default Home
