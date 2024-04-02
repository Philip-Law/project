import React, { useState, useEffect, useRef } from 'react'
import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export interface Message {
  id: number
  conversationId: number
  senderId: string
  content: string
  senderName: string
  senderImage: string
  postName: string
  postPrice: number
  sentAt: string
}

export interface Conversation {
  id: number
  postId: number
  senderName: string
  senderImage: string
  sellerId: string
  buyerId: string
  postName: string
  postPrice: number
  messages: Message[]
}

const ViewConversation = (): React.ReactElement => {
  const { user, getAccessTokenSilently } = useAuth0()
  const [messages, setMessages] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const conversation = location.state.conversation
  const inputRef = useRef<any>()
  const conversationId = conversation.id

  const getMessages = async (): Promise<any> => {
    setIsLoading(true)
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
        return []
      }

      const messages = await response.json()

      const enrichedMessages = await Promise.all(messages.map(async (message: any) => {
        const userDetails = await getUser(message.senderId as string)
        const postDetails = await getPost(conversation.postId as number)
        return {
          ...message,
          senderName: userDetails.firstName + ' ' + userDetails.lastName,
          senderImage: userDetails.picture,
          postName: postDetails.title,
          postPrice: postDetails.price
        }
      }))

      enrichedMessages.sort((a: any, b: any) => {
        return new Date(a.sentAt as string).getTime() - new Date(b.sentAt as string).getTime()
      }).reverse()
      console.log('Enriched Messages: ', enrichedMessages)
      setIsLoading(false)
      return enrichedMessages
    } catch (error) {
      console.error('Error fetching messages', error)
      return []
    }
  }

  async function getUser (senderId: string): Promise<any> {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`http://localhost:8080/user/${senderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

      })

      if (!response.ok) {
        // Handle response errors
        console.error(`User not found for ID ${senderId}`)
        throw new Error(`User not found for ID ${senderId}`)
      }

      const userDetails = await response.json()
      return userDetails
    } catch (error) {
      console.error('Error fetching user details', error)
      throw error // Propagate error to be handled by caller
    }
  }

  const getPost = async (postId: number): Promise<any> => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`http://localhost:8080/post/details/${postId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.error(`Post not found for ID ${postId}`)
        return {}
      }

      const postDetails = await response.json()
      return postDetails
    } catch (error) {
      console.error('Error fetching post details', error)
      return {}
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

  const formatDate = (date: string): string => {
    const d = new Date(date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    const optionsDate: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
    const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
    const formattedDate = d.toLocaleDateString('en-US', optionsDate)
    const formattedTime = d.toLocaleTimeString('en-US', optionsTime)
    return `${formattedDate} at ${formattedTime}`
  }

  if (isLoading) {
    return (
      <div className='App'>
        <header className='App-header'>
          <Nav />
          <div className='conversation-content'>
            <div className='conversation-header'>
              <h2>Chatting with {conversation.senderName}</h2>
              <div className='post-info'>
                <h3>{conversation.postName}</h3>
                <p>(${conversation.postPrice})</p>
              </div>
            </div>
            <div className='conversation-messages'>
              <div className='loading-content' id='message-load'>
                <span className="loader"></span>
              </div>
            </div>
            <div className='sendMessage'>
              <input type='text' ref={inputRef} placeholder='Send Message...' onKeyDown={handleKeyDown}/>
              <button onClick={() => { handleSendMessage().catch(error => { console.log(error) }) }}><FontAwesomeIcon icon={faPaperPlane} /></button>
            </div>
          </div>
        </header>
      </div>

    )
  }

  return (
        <div className='App'>
          <header className='App-header'>
            <Nav />
            <div className='conversation-content'>
              <div className='conversation-header'>
                <h2>Chatting with {conversation.senderName}</h2>
                <div className='post-info'>
                  <h3>{conversation.postName}</h3>
                  <p>(${conversation.postPrice})</p>
                </div>
              </div>
              <div className='conversation-messages'>
                  { (Array.isArray(messages) && messages.length > 0)
                    ? (
                        messages.map((message: Message) => (
                          message.senderId === user?.sub
                            ? (
                        <div key={message.id} className='message self'>
                          <div className='message-container'>
                            <div className='sender-info'>
                              <img src={message.senderImage} alt='' />
                              <div className='sender-info-col'>
                                <h2>{message.senderName}</h2>
                                <p>{formatDate(message.sentAt)}</p>
                              </div>
                            </div>
                            <p id='message-content'>{message.content}</p>
                          </div>
                        </div>
                              )
                            : (
                              <div key={message.id} className='message'>
                              <div className='message-container'>
                                <div className='sender-info'>
                                  <img src={message.senderImage} alt='' />
                                  <div className='sender-info-col'>
                                    <h2>{message.senderName}</h2>
                                    <p>{formatDate(message.sentAt)}</p>
                                  </div>
                                </div>
                                <p id='message-content'>{message.content}</p>
                              </div>
                            </div>
                              )
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
              <div className='sendMessage'>
                <input type='text' ref={inputRef} placeholder='Send Message...' onKeyDown={handleKeyDown}/>
                <button onClick={() => { handleSendMessage().catch(error => { console.log(error) }) }}><FontAwesomeIcon icon={faPaperPlane} /></button>
              </div>
            </div>
            </header>
          </div>
  )
}

export default ViewConversation
