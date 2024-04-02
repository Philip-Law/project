import React, { useState, useEffect } from 'react'
import '../style/Search.css'
import { useSearchParams } from 'react-router-dom'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Search = (): React.ReactElement => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [p] = useSearchParams()
  const [searchQuery, setQuery] = useState<string | undefined>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value)
    setQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    window.location.href = searchValue !== '' ? `/?title=${searchValue}` : '/'
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  useEffect(() => {
    const titleQuery = p.get('title')
    if (titleQuery !== null) {
      setQuery(p.get('title')?.toString())
    } else {
      setQuery('')
    }
  }, [p])

  return (
        <div className='search-container'>
            <div className='search-box'>
                <input type='text' id='search-input' placeholder={'What are you looking for?'} onChange={handleChange} onKeyPress={handleKeyPress} value={searchQuery}/>
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={ handleSubmit }/>
            </div>
        </div>
  )
}

export default Search
