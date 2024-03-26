import {
  Column, Entity, PrimaryColumn,
} from 'typeorm';

@Entity('users')
class User {
  constructor(auth0Id: string, phoneNumber: string, major: string, year: number) {
    this.id = auth0Id;
    this.major = major;
    this.year = year;
    this.phoneNumber = phoneNumber;
  }

  @PrimaryColumn({ name: 'id' })
    id: string;

  @Column({ name: 'phone_number', length: 15 })
    phoneNumber: string;

  @Column()
    major: string;

  @Column({ type: 'integer' })
    year: number;
}

export default User;
