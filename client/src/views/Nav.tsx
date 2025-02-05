import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faComments } from '@fortawesome/free-solid-svg-icons'
import '../style/Nav.css'
import NavUser from '../components/NavUser'
import NavPost from '../components/NavPost'
import Search from '../components/Search'

const Nav = (): React.ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const { isAuthenticated } = useAuth0()
  const handleNavToggle = (): void => {
    setOpen(!isOpen)
  }
  return (
    <div className='nav'>
        <div id='desktop' className='nav container'>
            <Link to='/' className='nav child left'>
                <img src={'/assets/tmu_logo.png'} alt='logo' className='logo' />
                <h2>TMU Connect</h2>
            </Link>
            <div className='nav child'>
                <Search/>
            </div>
            <div className='nav child right'>
              {
                isAuthenticated
                  ? <Link to={'/conversations'} className='nav-button'><FontAwesomeIcon icon={faComments}/></Link>
                  : null
              }
                <NavPost/>
                <NavUser/>
            </div>
        </div>

        <div id='mobile' className='nav container'>
            <div className='top-nav'>
                <Link to='/' className='mobile-left'>
                    <img src={'/assets/tmu_logo.png'} alt='logo' className='logo' />
                    <h2>TMU Connect</h2>
                </Link>
                <div className='mobile-right'>
                    <FontAwesomeIcon className={`${isOpen ? 'nav-icon active' : 'nav-icon'}`} icon={faBars} onClick={handleNavToggle}/>
                </div>
            </div>
            <div id={`${isOpen ? 'show' : 'hidden'}`} className='bottom-nav'>
                <div className='nav-user-container'>
                    {
                        isAuthenticated
                          ? <p>Welcome Back!</p>
                          : <p>Welcome!</p>
                    }
                    <NavUser />
                </div>
                <Search />
                <div className='action-row'>
                    {
                    isAuthenticated
                      ? <Link to={'/conversations'} className='nav-button'><FontAwesomeIcon icon={faComments}/></Link>
                      : null
                    }
                    <NavPost/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Nav
