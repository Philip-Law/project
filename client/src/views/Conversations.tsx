import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import '../style/Conversations.css'
import type { Conversation } from './ViewConversation'
import { useAuth0 } from '@auth0/auth0-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
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
        return []
      }

      const conversations = await response.json()
      console.log('Conversations response: ', conversations)
      const enrichedConversations = await Promise.all(
        conversations.map(async (conversation: any) => {
          const currentUserId = user?.sub
          let personResponse
          if (currentUserId === conversation.buyerId) {
            personResponse = await fetch(`http://localhost:8080/user/${conversation.sellerId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          } else {
            personResponse = await fetch(`http://localhost:8080/user/${conversation.buyerId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          }

          const postResponse = await fetch(`http://localhost:8080/post/details/${conversation.postId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (!personResponse.ok) {
            console.error(`Details not found for buyer ${conversation.buyerId}`)
            return conversation
          }

          const personDetails = await personResponse.json()
          const postDetails = await postResponse.json()
          return {
            ...conversation,
            senderName: personDetails.firstName + ' ' + personDetails.lastName,
            senderImage: personDetails.picture,
            postName: postDetails.title,
            postPrice: postDetails.price
          }
        })
      )

      console.log('Enriched Conversations: ', enrichedConversations)
      return enrichedConversations
    } catch (error) {
      console.error('Error fetching conversations', error)
      return [] // Return an empty array or a suitable value on error
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
            <p id='breadcrumbs'> <Link id='back-to' to='/'>Home</Link> <FontAwesomeIcon icon={faChevronRight} /> Conversations</p>
            <h1>Conversations</h1>
            <p>View, chat, and manage your conversations.</p>
          </div>
          <div className='conversations-list'>
            {((conversations?.length) != null) && conversations.length > 0
              ? (
                  conversations.map((conversation: Conversation) => (
                <div key={conversation.id} className='conversation'>
                  <div className='conversation-left'>
                    <div className='conversation-header'>
                      <h2>Conversation with {conversation.senderName}</h2>
                    </div>
                    <div className='conversation-details'>
                      <img src={conversation.senderImage} alt='buyer' />
                      <div className='conversation-post-info'>
                        <p id='title'>{conversation.postName}</p>
                        <p id='price'>${conversation.postPrice}</p>
                      </div>
                    </div>
                  </div>
                  <div className='conversation-right'>
                    <button onClick={() => { handleClick(conversation) }}>View Messages</button>
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
