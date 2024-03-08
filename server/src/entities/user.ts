import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
class User {
  constructor(id: number, auth0Id: string, major: string, year: number) {
    this.id = id;
    this.auth0Id = auth0Id;
    this.major = major;
    this.year = year;
  }

  @PrimaryGeneratedColumn()
    id: number;

  @Column({ unique: true, name: 'auth0_id' })
    auth0Id: string;

  @Column()
    major: string;

  @Column({ type: 'integer' })
    year: number;
}

export default User;
