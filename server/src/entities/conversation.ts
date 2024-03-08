import {
  Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user';
import Post from './post';

@Entity('conversations')
class Conversation {
  constructor(id: number, post: Post, author: User, buyer: User) {
    this.id = id;
    this.post = post;
    this.seller = author;
    this.buyer = buyer;
  }

  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
    post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
    seller: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyer_id' })
    buyer: User;
}

export default Conversation;
