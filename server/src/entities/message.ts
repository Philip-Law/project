import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import DatabaseUser from './user';
import Conversation from './conversation';

@Entity('messages')
class Message {
  constructor(
    id: number,
    conversation: Conversation,
    sender: DatabaseUser,
    content: string,
    sentAt: Date,
  ) {
    this.id = id;
    this.conversation = conversation;
    this.sender = sender;
    this.content = content;
    this.sentAt = sentAt;
  }

  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversation_id' })
    conversation: Conversation;

  @ManyToOne(() => DatabaseUser)
  @JoinColumn({ name: 'sender_id' })
    sender: DatabaseUser;

  @Column()
    content: string;

  @Column({
    type: 'timestamp',
    name: 'sent_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
    sentAt: Date;
}

export default Message;
