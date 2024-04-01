import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'
import '../style/Conversations.css'
import type { Conversation } from './ViewConversation'
import { useAuth0 } from '@auth0/auth0-react'
// You can add Messages to this import statement so you can retrieve latest message for each conversation.
interface ConversationsProps {
  conversations?: Conversation[]
}

const Conversations: React.FC<ConversationsProps> = (props: ConversationsProps): React.ReactElement => {
  const [conversations, setConversations] = useState<any>([])
  const { user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  const getConversations = async (): Promise<any> => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch('http://localhost:8080/conversation/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        console.error(`Conversations not found for user ${user?.sub}`)
      }
      const jsonResponse = await response.json()
      console.log('Conversations response: ', jsonResponse)
      return jsonResponse
    } catch (error) {
      console.error('Error fetching conversations', error)
    }
  }

  const handleClick = (conversation: Conversation): void => {
    navigate('/viewconversation', { state: { conversation } })
  }

  useEffect(() => {
    const renderConversations = async (): Promise<any> => {
      const newConversations = await getConversations()
      if (conversations !== newConversations) {
        setConversations(newConversations)
      }
    }
    void renderConversations()
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <Nav />
        <div className='conversations container'>
          <div className='conversations-header'>
            <h1>Conversations</h1>
            <p>View, chat, and manage your conversations.</p>
          </div>
          <div className='conversations-list'>
            {((conversations?.length) != null) && conversations.length > 0
              ? (
                  conversations.map((conversation: Conversation) => (
                <div key={conversation.id} className='conversation'>
                  <div className='conversation-header' onClick={() => { handleClick(conversation) }}>
                    <h2>Conversation with {conversation.buyerId === user?.sub ? conversation.sellerId : conversation.buyerId}</h2>
                  </div>
                  <div className='conversation-messages'>
                  </div>
                </div>
                  ))
                )
              : (
              <p>No conversations found.</p>
                )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default Conversations
