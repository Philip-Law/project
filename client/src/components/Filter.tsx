import React, { useState, useEffect } from 'react'
import '../style/Filter.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faLocationDot } from '@fortawesome/free-solid-svg-icons'

interface FilterProps {
  setFilters: React.Dispatch<React.SetStateAction<{ location?: string, adType?: string[] }>>
}

const Filter: React.FC<FilterProps> = ({ setFilters }): React.ReactElement => {
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Current Location')
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    const getLocations = async (): Promise<void> => {
      await fetch('http://localhost:8080/post/locations', {
        method: 'GET'
      })
        .then(async response => {
          if (!response.ok) {
            console.error('Locations not found')
          }

          const jsonResponse = await response.json()
          const locationsArray = jsonResponse.map((item: { location: any }) => item.location)
          setLocations(locationsArray as string[])
        })
    }

    void getLocations()
  }, [])

  const handleDropdownToggle = (): void => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOptionSelect = (option: string): void => {
    setSelectedOption(option)
    setDropdownOpen(false)
  }

  const handleCategoryChange = (categoryValue: string): void => {
    if (categories.includes(categoryValue)) {
      setCategories(categories.filter(category => category !== categoryValue))
    } else {
      setCategories([...categories, categoryValue])
    }
  }

  const handleSortByChange = (sortByValue: string): void => {
    if (sortBy === sortByValue) {
      setSortBy(null)
    } else {
      setSortBy(sortByValue)
    }
  }

  const handleClearFilters = (): void => {
    setSortBy(null)
    setCategories([])
    setSelectedOption('Current Location')

    setFilters(prevFilters => ({
      ...prevFilters,
      location: '',
      adType: []
    }))
  }

  const handleApplyFilters = (): void => {
    console.log('Applying filters')
    if (selectedOption === 'Current Location') {
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

    setFilters(prevFilters => ({
      ...prevFilters,
      location: selectedOption !== 'Current Location' ? selectedOption : ' ',
      adType: categories
    }))
  }

  return (
        <div className='filters'>
            <h2>Filters</h2>
            <p className='subheading'>Specify filters to make your search easier.</p>
            <div className='btn-row'>
                <button className='btn' onClick={handleApplyFilters}>Apply Filters</button>
                <button className='btn' onClick={handleClearFilters}>Clear Filters</button>
            </div>
            <hr />
            <h3>Ad Type</h3>
            <div className='check'>
                <input type="checkbox" id='wanted' name="wanted" value="W" onChange={() => { handleCategoryChange('W') }} checked={ categories.includes('W') }/>
                <label htmlFor="wanted">Items Wanted</label><br />
            </div>
            <div className='check'>
                <input type="checkbox" id='for-sale' name="for-sale" value="S" onChange={() => { handleCategoryChange('S') }} checked={ categories.includes('S') }/>
                <label htmlFor="for-sale">Items For Sale</label><br />
            </div>
            <div className='check'>
                <input type="checkbox" id='academic-services' name="academic-services" value="A" onChange={() => { handleCategoryChange('A') }} checked={ categories.includes('A') }/>
                <label htmlFor="academic-services"> Academic Services</label><br />
            </div>
            <hr />
            <h3>Location</h3>
            <div className='dropdown'>
                <div className='dropdown-text' onClick={handleDropdownToggle}>
                        <FontAwesomeIcon icon={faLocationDot}/>
                        <span>{selectedOption}</span>
                        <FontAwesomeIcon icon={dropdownOpen ? faChevronDown : faChevronUp } />
                </div>
                <ul id='list' className={`dropdown-list ${dropdownOpen ? 'show' : ''}`}>
                        {locations.map((location) => (
                          <li key={location} className='dropdown-list-item' onClick={() => { handleOptionSelect(location) }}>{location}</li>
                        ))}
                </ul>
            </div>
            <hr />
            <h3>Sort By</h3>
            <div className='check'>
                <input type="radio" id="lowToHigh" name="sortBy" value="lowToHigh" onChange={() => { handleSortByChange('lowToHigh') }} checked={sortBy === 'lowToHigh'} />
                <label htmlFor="lowToHigh"><strong>Price:</strong> Low to High</label><br />
            </div>
            <div className='check'>
                <input type="radio" id="highToLow" name="sortBy" value="highToLow" onChange={() => { handleSortByChange('highToLow') }} checked={sortBy === 'highToLow'} />
                <label htmlFor="highToLow"><strong>Price:</strong> High to Low</label><br />
            </div>
            <div className='check'>
                <input type="radio" id="newestToOldest" name="sortBy" value="newestToOldest" onChange={() => { handleSortByChange('newestToOldest') }} checked={sortBy === 'newestToOldest'} />
                <label htmlFor="newestToOldest"><strong>Date:</strong> Newest to Oldest</label><br />
            </div>
            <div className='check'>
                <input type="radio" id="oldestToNewest" name="sortBy" value="oldestToNewest" onChange={() => { handleSortByChange('oldestToNewest') }} checked={sortBy === 'oldestToNewest'} />
                <label htmlFor="oldestToNewest"><strong>Date:</strong> Oldest to Newest</label><br />
            </div>
        </div>
  )
}

export default Filter
