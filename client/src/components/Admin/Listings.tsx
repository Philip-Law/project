import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import './style/Listings.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'

interface Post {
  id: number
  postDate: string
  title: string
  location: string
  description: string
  adType: string
  category: string[]
  price: string
}

const Listings = (): React.ReactElement => {
  const { getAccessTokenSilently } = useAuth0()
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [inputText, setInputText] = useState('')
  const [filter, setFilter] = useState('')
  const [query, setQuery] = useState('')
  const [queryActive, setQueryActive] = useState(false)
  const itemsPerPage = 10

  const getToken = async (): Promise<string> => {
    return await getAccessTokenSilently()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    if (e.target.name === 'filter') {
      setFilter(e.target.value)
    } else if (e.target.name === 'search-query') {
      setInputText(e.target.value)
    }
  }

  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8080/post${query}`, {
        method: 'GET'
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        const posts = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          location: post.location,
          category: post.categories,
          price: post.price,
          description: post.description,
          adType: post.adType,
          postDate: post.postDate
        }))
        setPosts(posts)
        if (query !== '') {
          setQueryActive(true)
        }
        setIsLoading(false)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function deletePost (postID: number): Promise<void> {
    const token = await getToken()
    void fetch(`http://localhost:8080/post/${postID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async response => {
        if (response.status !== 200) {
          console.error('Ad could not be deleted')
        } else {
          void fetchPosts()
        }
      })
  }

  useEffect(() => {
    fetchPosts().catch(console.error)
  }, [query])

  const handleSearch = (): void => {
    if ((filter !== '') && (inputText !== '')) {
      const newQuery = `?${filter}=${inputText}`
      setQuery(newQuery) // Set the query for fetching posts
    } else {
      // Handle the case where filter or inputText might not be set
      console.log('Please select a filter and enter a query')
    }
  }

  const handleClearSearch = (): void => {
    setQueryActive(false)
    setQuery('')
  }

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setCurrentPage(selected)
  }
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem)

  const totalResultsText = currentPage === Math.ceil(posts.length / itemsPerPage) - 1
    ? `Displaying ${posts.length} of ${posts.length} results`
    : `Displaying ${currentItems.length} of ${posts.length} results`

  return (
    <div className='listing-container'>
      <div className='listing-header'>
        <div className='search'>
          <select name='filter' id='filter' onChange={handleInputChange}>
            <option value='' selected disabled hidden>Filter by...</option>
            <option value='category'>Category</option>
            <option value='location'>Location</option>
            <option value='ad-type'>Ad Type</option>
            <option value='title'>Title</option>
          </select>
          <input className={`${filter === '' ? 'disabled' : null}`} name='search-query' onChange={handleInputChange} type='text' placeholder={`Search by ${filter}...`} />
          <button onClick={handleSearch}>Search</button>
        </div>
        {
          queryActive
            ? <button className='clear-search' onClick={() => { handleClearSearch() }}>Clear Search</button>
            : null
        }
        <p>{totalResultsText}</p>
      </div>
      <div className='listing-table'>
        <ReactPaginate
          nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
          previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
          pageCount={Math.ceil(posts.length / itemsPerPage)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          forcePage={currentPage}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Post Date</th>
              <th>Title</th>
              <th>Location</th>
              <th>Categories</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              posts.length === 0
                ? <tr>
                  {
                    isLoading
                      ? <td colSpan={7}>Loading...</td>
                      : <td colSpan={7}>No posts available</td>
                  }
                  </tr>
                : currentItems.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.postDate}</td>
                      <td>{post.title}</td>
                      <td>{post.location}</td>
                      <td>{post.category.join(', ')}</td>
                      <td>${post.price}</td>
                      <td>
                        <FontAwesomeIcon title='Delete Listing' icon={faTimesCircle} onClick={() => { void deletePost(post.id) }} />
                      </td>
                    </tr>
                ))
            }
          </tbody>
        </table>
        <ReactPaginate
          nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
          previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
          pageCount={Math.ceil(posts.length / itemsPerPage)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          forcePage={currentPage}
          containerClassName={'pagination'}
          activeClassName={'active'}
          className='pagination bottom-pagination'
        />
      </div>
    </div>
  )
}

export default Listings
