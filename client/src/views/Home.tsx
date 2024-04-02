import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../style/Home.css'
import Nav from './Nav'
import Filter from '../components/Filter'
import Listings from '../components/Listings'
import FilterMobile from '../components/FilterMobile'

const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg'

const Home = (): React.ReactElement => {
  const [listings, setListings] = useState<any>([])
  const [p] = useSearchParams()
  const [filters, setFilters] = useState<any>({
    location: '',
    adType: [],
    sort: ''
  })

  const convertType = async (input: string): Promise<string> => {
    if (input === 'W') {
      return 'Wanted'
    } else if (input === 'A') {
      return 'Academic Service'
    } else {
      return 'Selling'
    }
  }

  const getImage = async (id: string): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:8080/post/image/${id}`, {
        method: 'GET'
      })

      if (!response.ok) {
        console.error('Images not found')
        return
      }
      const jsonResponse = await response.json()
      if (jsonResponse.length === 0) {
        return [PLACEHOLDER_IMAGE]
      } else {
        return jsonResponse
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const getListings = async (): Promise<any> => {
    try {
      const title = p.get('title') !== null ? p.get('title') : ''
      const location = filters.location.trim()
      const adTypes = filters.adType
      const sortBy = filters.sort

      let url: string = 'http://localhost:8080/post?'
      if (title !== '') {
        url += `&title=${title}`
      }
      if (location !== '') {
        url += `&location=${location}`
      }
      if (adTypes.length > 0) {
        url += `&adType=${adTypes}`
      }
      if (sortBy !== '') {
        url += `&sort=${sortBy}`
      }

      const response = await fetch(url, {
        method: 'GET'
      })
      if (!response.ok) {
        console.error('Details not found')
        return {}
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching details:', error)
    }
  }

  useEffect(() => {
    const renderPosts = async (): Promise<any> => {
      const posts = await getListings()

      if (posts !== undefined) {
        try {
          const newListings = await Promise.all(posts.map(async (post: any) => {
            const img = await getImage(post.id as string)
            if (img !== undefined) {
              const listingInfo = {
                id: post.id,
                title: post.title,
                adType: await convertType(post.adType as string),
                imgPaths: img,
                description: post.description,
                location: post.location,
                categories: Array.from(post.categories as string),
                price: parseFloat(post.price as string),
                postDate: post.postDate
              }

              return listingInfo
            }
          }))
          setListings(newListings)
        } catch {
        }
      }
    }
    void renderPosts()
  }, [filters, p])

  return (
        <div className="App">
            <header className="App-header">
                <Nav/>
                <div className='content'>
                  <Filter setFilters={setFilters}/>
                  <FilterMobile setFilters={setFilters}/>
                  <Listings response={listings}/>
                </div>
            </header>
        </div>
  )
}

export default Home
