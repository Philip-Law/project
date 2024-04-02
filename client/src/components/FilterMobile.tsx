import React, { useState, useEffect } from 'react'
import '../style/Filter.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useApi } from '../context/APIContext'

interface FilterProps {
  setFilters: React.Dispatch<React.SetStateAction<{ location?: string, adType?: string[], sort: string }>>
}

const FilterMobile: React.FC<FilterProps> = ({ setFilters }): React.ReactElement => {
  const [sortBy, setSortBy] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Select a Location')
  const [isOpen, setOpen] = useState(false)
  const [locations, setLocations] = useState<string[]>([])
  const { sendRequest } = useApi()

  useEffect(() => {
    const getLocations = async (): Promise<void> => {
      const { status, response, error } = await sendRequest<string[]>({
        method: 'GET',
        endpoint: 'post/locations'
      })
      if (status !== 200) {
        console.log(`Failed to get locations: ${error}`)
        return
      }
      setLocations(response)
    }

    void getLocations()
  }, [])

  const handleOpen = (): void => {
    setOpen(!isOpen)
  }

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
      setSortBy('')
    } else {
      setSortBy(sortByValue)
    }
  }

  const handleClearFilters = (): void => {
    setSortBy('')
    setCategories([])
    setSelectedOption('')

    setFilters(prevFilters => ({
      ...prevFilters,
      location: '',
      adType: [],
      sort: ''
    }))
  }

  const handleApplyFilters = (): void => {
    console.log('Applying filters')

    setFilters(prevFilters => ({
      ...prevFilters,
      location: selectedOption !== 'Select a Location' ? selectedOption : ' ',
      adType: categories,
      sort: sortBy
    }))
  }

  return (
        <div className='filters mobile'>
            <div className='inside'>
                <div className='toggle-bar'>
                    <div className='left'>
                        <h2>Filters</h2>
                        <p className='subheading'>Specify filters to make your search easier.</p>
                    </div>
                    <div className='right'>
                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} onClick={handleOpen} />
                    </div>
                </div>
                <div id={isOpen ? 'show' : 'hide'} className='filter-content'>
                    <div className='btn-row'>
                        <button className='btn' onClick={handleApplyFilters}>Apply Filters</button>
                        <button className='btn' onClick={handleClearFilters}>Clear Filters</button>
                    </div>
                    <hr />
                    <h3>Categories</h3>
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
                        <input type="radio" id="lowToHigh" name="sortBy" value="price|ASC" onChange={() => { handleSortByChange('price|ASC') }} checked={sortBy === 'price|ASC'} />
                        <label htmlFor="lowToHigh"><strong>Price:</strong> Low to High</label><br />
                    </div>
                    <div className='check'>
                        <input type="radio" id="highToLow" name="sortBy" value="price|DESC" onChange={() => { handleSortByChange('price|DESC') }} checked={sortBy === 'price|DESC'} />
                        <label htmlFor="highToLow"><strong>Price:</strong> High to Low</label><br />
                    </div>
                    <div className='check'>
                        <input type="radio" id="newestToOldest" name="sortBy" value="post_date|DESC" onChange={() => { handleSortByChange('post_date|DESC') }} checked={sortBy === 'post_date|DESC'} />
                        <label htmlFor="newestToOldest"><strong>Date:</strong> Newest to Oldest</label><br />
                    </div>
                    <div className='check'>
                        <input type="radio" id="oldestToNewest" name="sortBy" value="post_date|ASC" onChange={() => { handleSortByChange('post_date|ASC') }} checked={sortBy === 'post_date|ASC'} />
                        <label htmlFor="oldestToNewest"><strong>Date:</strong> Oldest to Newest</label><br />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default FilterMobile
