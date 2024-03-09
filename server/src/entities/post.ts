import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import DatabaseUser from './user';

@Entity('posts')
class Post {
  constructor(
    id: number,
    user: DatabaseUser,
    title: string,
    adType: string,
    description: string,
    location: string,
    categories: string[],
    price: number,
    postDate: Date,
  ) {
    this.id = id;
    this.user = user;
    this.title = title;
    this.adType = adType;
    this.description = description;
    this.location = location;
    this.categories = categories;
    this.price = price;
    this.postDate = postDate;
  }

  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => DatabaseUser)
  @JoinColumn({ name: 'user_id' })
    user: DatabaseUser;

  @Column()
    title: string;

  @Column({ length: 1 })
    adType: string;

  @Column()
    description: string;

  @Column()
    location: string;

  @Column({ type: 'varchar', array: true })
    categories: string[];

  @Column({ type: 'decimal' })
    price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    postDate: Date;
}

export default Post;
