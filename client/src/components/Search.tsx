import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../style/Search.css'
import { faChevronDown, faChevronUp, faMagnifyingGlass, faLocationDot } from '@fortawesome/free-solid-svg-icons'

const Search = (): React.ReactElement => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Current Location')
    const [searchPlaceholder, setSearchPlaceholder] = useState('Search anything...')

    const handleDropdownToggle = (): void => {
      setDropdownOpen(!dropdownOpen)
    }

    const handleOptionSelect = (option: string): void => {
      setSelectedOption(option)
      setSearchPlaceholder(option === 'Everything' ? 'Search Anything...' : `Search in ${option}...`)
      setDropdownOpen(false)
    }

    const [location] = useState('current')
    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault()
      console.log(e)
      if (location === 'current') {
          navigator.geolocation.getCurrentPosition(
              (position) => {
              const { latitude, longitude } = position.coords
              console.log('Latitude:', latitude)
              console.log('Longitude:', longitude)
              },
              (error) => {
              console.error('Error getting location:', error.message)
              }
          )
      }
    }
    return (
        <div className='search-container'>
            <div className='dropdown'>
                <div className='dropdown-text' onClick={handleDropdownToggle}>
                        <FontAwesomeIcon icon={faLocationDot}/>
                        <span>{selectedOption}</span>
                        <FontAwesomeIcon icon={dropdownOpen ? faChevronDown : faChevronUp } />
                </div>
                <ul id='list' className={`dropdown-list ${dropdownOpen ? 'show' : ''}`}>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('Current Location') }}>Current Location</li>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('Toronto') }}>Toronto</li>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('Vaughan') }}>Vaughan</li>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('Scarborough') }}>Scarborough</li>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('North York') }}>North York</li>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('Barrie') }}>Barrie</li>
                        <li className='dropdown-list-item' onClick={() => { handleOptionSelect('Aurora') }}>Aurora</li>

                </ul>
            </div>
            <div className='search-box'>
                <input type='text' id='search-input' placeholder={ searchPlaceholder } />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={ handleSubmit }/>
            </div>
        </div>
      )
}

export default Search
