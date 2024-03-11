import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import '../style/Nav.css'
import NavUser from '../components/NavUser'
import Search from '../components/Search'

const Nav = (): React.ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const handleNavToggle = (): void => {
    setOpen(!isOpen)
  }
  return (
    <div className='nav'>
        <div id='desktop' className='nav container'>
            <div className='nav child left'>
                <img src={'/assets/tmu_logo.png'} alt='logo' className='logo' />
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

        <div id='mobile' className='nav container'>
            <div className='top-nav'>
                <div className='mobile-left'>
                    <img src={'/assets/tmu_logo.png'} alt='logo' className='logo' />
                    <h2>TMU Connect</h2>
                </div>
                <div className='mobile-right'>
                    <FontAwesomeIcon className={`${isOpen ? 'nav-icon active' : 'nav-icon'}`} icon={faBars} onClick={handleNavToggle}/>
                </div>
            </div>
            <div id={`${isOpen ? 'show' : 'hidden'}`} className='bottom-nav'>
                <Search />
                <div className={`nav-user-container ${isOpen ? 'show' : ''}`}>
                    <NavUser />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Nav
