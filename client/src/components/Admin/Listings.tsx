import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import './style/Listings.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

interface Post {
  id: number
  title: string
}

const Listings = (): React.ReactElement => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:8080/post', {
          method: 'GET'
        })
        const data = await response.json()
        if (Array.isArray(data)) {
          setPosts(data)
        } else {
          console.error('Received invalid data format for posts:', data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    void fetchPosts()
  }, [])

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setCurrentPage(selected)
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem)

  const totalResultsText = currentPage === Math.ceil(posts.length / itemsPerPage) - 1
    ? `Displaying ${posts.length} of ${posts.length} results.`
    : `Displaying ${currentItems.length} of ${posts.length} results.`

  return (
    <div className='listing-container'>
      <div className='listing-header'>
        <div className='search'>
          <input type='text' placeholder='Search...' />
          <button>Search</button>
        </div>
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
              <th>Title</th>
              <th>User</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {
              posts.length === 0
                ? <tr><td style={{ padding: '1rem' }} colSpan={4}>No posts available</td></tr>
                : posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      {/* Add more table cells as needed */}
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
