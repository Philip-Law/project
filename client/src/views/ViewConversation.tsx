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
  post_id: number
  seller_id: number
  buyer_id: number
  messages: Messages[]
}

const ViewConversation: React.FC<Conversation> = (props: Conversation): React.ReactElement => {
  return (
        <div className='conversation'>
        <div className='conversation-header'>
            <h2>Conversation with {props.buyer_id}</h2>
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
