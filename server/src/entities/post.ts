import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user';
import { AdType } from '../types/custom';

@Entity('posts')
class Post {
  constructor(
    id: number,
    user: User,
    title: string,
    adType: AdType,
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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
    user: User;

  @Column()
    title: string;

  @Column({ length: 1, name: 'ad_type', type: 'varchar' })
    adType: AdType;

  @Column()
    description: string;

  @Column()
    location: string;

  @Column({ type: 'varchar', array: true })
    categories: string[];

  @Column({ type: 'decimal' })
    price: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'post_date',
  })
    postDate: Date;
}

export default Post;
