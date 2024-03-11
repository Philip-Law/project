import React, { useState } from 'react'
import '../style/Search.css'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Search = (): React.ReactElement => {
  const [searchValue, setSearchValue] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    console.log(searchValue)
  }
  return (
        <div className='search-container'>
            <div className='search-box'>
                <input type='text' id='search-input' placeholder={ 'What are you looking for?' } onChange={handleChange}/>
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={ handleSubmit }/>
            </div>
        </div>
  )
}

export default Search
