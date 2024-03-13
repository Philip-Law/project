import {
  Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './post';
import User from './user';

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'seller_id' })
    seller: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'buyer_id' })
    buyer: User;
}

export default Conversation;
