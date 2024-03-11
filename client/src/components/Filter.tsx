import React, { useState } from 'react'
import '../style/Filter.css'

const Filter = (): React.ReactElement => {
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

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
  }

  return (
        <div className='filters'>
            <h2>Filters</h2>
            <p className='subheading'>Specify filters to make your search easier.</p>
            <div className='btn-row'>
                <button className='btn'>Apply Filters</button>
                <button className='btn' onClick={handleClearFilters}>Clear Filters</button>
            </div>
            <hr />
            <h3>Categories</h3>
            <div className='check'>
                <input type="checkbox" id='wanted' name="wanted" value="wanted" onChange={() => { handleCategoryChange('wanted') }} checked={ categories.includes('wanted') }/>
                <label htmlFor="wanted">Items Wanted</label><br />
            </div>
            <div className='check'>
                <input type="checkbox" id='for-sale' name="for-sale" value="for-sale" onChange={() => { handleCategoryChange('for-sale') }} checked={ categories.includes('for-sale') }/>
                <label htmlFor="for-sale">Items For Sale</label><br />
            </div>
            <div className='check'>
                <input type="checkbox" id='academic-services' name="academic-services" value="academic-services" onChange={() => { handleCategoryChange('academic-services') }} checked={ categories.includes('academic-services') }/>
                <label htmlFor="academic-services"> Academic Services</label><br />
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
