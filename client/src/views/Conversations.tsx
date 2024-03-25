import React from 'react'
import Nav from './Nav'
import '../style/Conversations.css'
import type { Conversation } from './ViewConversation'
// You can add Messages to this import statement so you can retrieve latest message for each conversation.
interface ConversationsProps {
  conversations?: Conversation[]
}

const Conversations: React.FC<ConversationsProps> = (props: ConversationsProps): React.ReactElement => {
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
            {((props.conversations?.length) != null) && props.conversations.length > 0
              ? (
                  props.conversations.map((conversation: Conversation) => (
                <div key={conversation.id} className='conversation'>
                  <div className='conversation-header'>
                    <h2>Conversation with {conversation.buyer_id}</h2>
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
