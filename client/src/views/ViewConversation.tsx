import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from 'react-router-dom'

export interface Message {
  id: number
  conversationId: number
  senderId: string
  content: string
  sent_at: string
}

export interface Conversation {
  id: number
  postId: number
  sellerId: string
  buyerId: string
  messages: Message[]
}

const ViewConversation = (): React.ReactElement => {
  const { user, getAccessTokenSilently } = useAuth0()
  const [messages, setMessages] = useState<any>([])
  const location = useLocation()
  const conversation = location.state.conversation
  const inputRef = useRef<any>()
  const conversationId = conversation.id

  const getMessages = async (): Promise<any> => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`http://localhost:8080/message/${conversationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        console.error(`Messages not found for conversation ${conversationId}`)
      }
      const jsonResponse = await response.json()
      return jsonResponse
    } catch (error) {
      console.error('Error fetching messages', error)
    }
  }

  const handleSendMessage = async (): Promise<any> => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`http://localhost:8080/message/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          senderId: user?.sub,
          content: inputRef.current.value
        })
      })
      if (!response.ok) {
        console.error(`Error posting message to conversation ${conversationId}`)
      }
      const jsonResponse = await response.json()
      const newMessages = await getMessages()
      if (response.ok) setMessages(newMessages)
      if (inputRef.current.value !== null) inputRef.current.value = null
      return jsonResponse
    } catch (error) {
      console.error('Error with message send fetch request: ', error)
    }
  }

  useEffect(() => {
    const renderMessages = async (): Promise<any> => {
      const newMessages = await getMessages()
      if (Array.isArray(newMessages) && messages !== newMessages) {
        setMessages(newMessages)
      }
    }
    void renderMessages()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage().catch(error => { console.log(error) })
    }
  }

  return (
        <div className='conversation'>
        <div className='conversation-header'>
            <h2>Conversation with SOMEONE?!?!?!?</h2>
        </div>
        <div className='conversation-messages'>
            { (Array.isArray(messages) && messages.length > 0)
              ? (
                  messages.map((message: Message) => (
                  <div key={message.id} className='message'>
                      <h2>{message.senderId}</h2>
                      <p>{message.content}</p>
                  </div>
                  ))
                )
              : (Array.isArray(messages) && messages.length === 0)
                  ? (
                      <div>No messages</div>
                    )
                  : (
                <div>Error retrieving messages. Please wait a few moments and then refresh the page.</div>
                    )}
        </div>
        <div>
          <input type='text' ref={inputRef} onKeyDown={handleKeyDown}/>
          <button onClick={() => { handleSendMessage().catch(error => { console.log(error) }) }}>Send Message</button>
        </div>
        </div>
  )
}

export default ViewConversation
