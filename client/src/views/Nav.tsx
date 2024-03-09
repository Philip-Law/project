import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../style/Nav.css'
import NavUser from '../components/NavUser'
import Search from '../components/Search'
import logo from '../assets/tmu_logo.png'

const Nav = (): React.ReactElement => {
  return (
    <div className='nav'>
        <div className='nav container'>
            <div className='nav child left'>
                <img src={logo} alt='logo' className='logo' />
                <h2>TMU Connect</h2>
            </div>
            <div className='nav child'>
                <Search />
            </div>
            <div className='nav child right'>
                <button className='nav-button'>Post Ad</button>
                <NavUser/>
            </div>
        </div>
    </div>
  )
}

export default Nav
