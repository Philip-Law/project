import React from 'react'
import '../style/Home.css'
import Nav from './Nav'
import SetupInput from '../components/SetupInput'

const PostAd = (): React.ReactElement => {
  return (
        <div className="App">
            <header className="App-header">
                <Nav/>
                <div className='content'>
                  <SetupInput/>
                </div>
            </header>
        </div>
  )
}

export default PostAd
