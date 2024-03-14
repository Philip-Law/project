import {
  Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import DatabaseUser from './user';
import Post from './post';

@Entity('conversations')
class Conversation {
  constructor(id: number, post: Post, author: DatabaseUser, buyer: DatabaseUser) {
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

  @ManyToOne(() => DatabaseUser)
  @JoinColumn({ name: 'seller_id' })
    seller: DatabaseUser;

  @ManyToOne(() => DatabaseUser)
  @JoinColumn({ name: 'buyer_id' })
    buyer: DatabaseUser;
}

export default Conversation;
