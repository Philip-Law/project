import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  constructor(id: number, auth0Id: string, phoneNumber: string, major: string, year: number) {
    this.id = id;
    this.auth0Id = auth0Id;
    this.major = major;
    this.year = year;
    this.phoneNumber = phoneNumber;
  }

  @PrimaryGeneratedColumn()
    id: number;

  @Column({ unique: true, name: 'auth0_id' })
    auth0Id: string;

  @Column({ name: 'phone_number', length: 15 })
    phoneNumber: string;

  @Column()
    major: string;

  @Column({ type: 'integer' })
    year: number;
}

export default User;
