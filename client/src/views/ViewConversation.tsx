import React from 'react'

export interface Messages {
  id: number
  conversation_id: number
  sender_id: number
  message: string
  sent_at: string
}

export interface Conversation {
  id: number
  postId: number
  sellerId: string
  buyerId: string
  messages: Messages[]
}

const ViewConversation: React.FC<Conversation> = (props: Conversation): React.ReactElement => {
  return (
        <div className='conversation'>
        <div className='conversation-header'>
            <h2>Conversation with {props.buyerId}</h2>
        </div>
        <div className='conversation-messages'>
            {props.messages.map((message: Messages) => (
            <div key={message.id} className='message'>
                <p>{message.message}</p>
            </div>
            ))}
        </div>
        </div>
  )
}

export default ViewConversation
