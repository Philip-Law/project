import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Conversation from './conversation';
import User from './user';

@Entity('messages')
class Message {
  constructor(
    id: number,
    conversation: Conversation,
    sender: User,
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

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.id,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'conversation_id', referencedColumnName: 'id' })
    conversation: Conversation;

  @ManyToOne(
    () => User,
    (user) => user.id,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender: User;

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
