import React from 'react'
import '../style/Home.css'
import Nav from './Nav'
import CreatePost from '../components/CreatePost'

const PostAd = (): React.ReactElement => {
  const listings = [
    {
      id: 1,
      adType: 2,
      imgPath: '/assets/placeholder.jpg',
      title: 'Electronics Sale',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ante in libero consectetur efficitur. This is sample text and can be changed at a later date.',
      location: 'New York',
      categories: 'Electronics',
      price: 100.99,
      postDate: '2023-12-21'
    }
  ]
  return (
        <div className="App">
            <header className="App-header">
                <Nav/>
                <div className='content'>
                  <CreatePost/>
                </div>
            </header>
        </div>
  )
}

export default PostAd
