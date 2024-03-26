import React, { useEffect, useState } from 'react'
import '../style/Home.css'
import Nav from './Nav'
import Filter from '../components/Filter'
import Listings from '../components/Listings'
import FilterMobile from '../components/FilterMobile'
import { json } from 'stream/consumers'

const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg'

const Home = (): React.ReactElement => {
  const [listings, setListings] = useState<any>([])

  const convertType = async (input: string): Promise<string> => {
    if (input === 'W') {
      return 'Wanted'
    } else if (input === 'A') {
      return 'Academic Service'
    } else {
      return 'Selling'
    }
  }

  const getImage = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/post/image/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Images not found')
        return;
      }
      const jsonResponse = await response.json()
      if(jsonResponse.length === 0) {
        return [PLACEHOLDER_IMAGE]
      } else {
        return jsonResponse
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const getListings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post`, {
        method: 'GET',
      })
      if (!response.ok) {
        console.error('Details not found')
        return;
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching details:', error)
    }
  }

  useEffect(() => {
    const renderPosts = async () => {
      const posts = await getListings();

      const newListings = await Promise.all(posts.map(async (post: any) => {
        
        const img = await getImage(post.id)
        if(img !== "") {
          const listingInfo = {
            id: post.id,
            title: post.title,
            adType: await convertType(post.adType),
            imgPaths: img,
            description: post.description,
            location: post.location,
            categories: Array.from(post.categories),
            price: post.price,
            postDate: post.postDate
          }
  
          return listingInfo
        }
      }))
  
      setListings(newListings);
    }
    renderPosts()
  }, [])
  
  return (
        <div className="App">
            <header className="App-header">
                <Nav/>
                <div className='content'>
                  <Filter/>
                  <FilterMobile/>
                  <Listings response={listings}/>
                </div>
            </header>
        </div>
  )
}

export default Home
