/* eslint-disable prettier/prettier */
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Report } from '../reports/report.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id:', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id:', this.id);
  }
}
