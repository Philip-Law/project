import React from 'react'
import Nav from './Nav'
import '../style/Conversations.css'

const Conversations = (): React.ReactElement => {
  return (
    <div className='App'>
        <header className='App-header'>
        <Nav/>
        <div className='conversations container'>
            <h1>Conversations</h1>
        </div>
        </header>
    </div>
  )
}

export default Conversations
