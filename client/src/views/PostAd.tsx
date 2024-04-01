import React from 'react'
import '../style/Home.css'
import Nav from './Nav'
import CreatePost from '../components/CreatePost'

const PostAd = (): React.ReactElement => {
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
