import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  roomKey: string;

  @Column({ nullable: false })
  lat: number;

  @Column({ nullable: false })
  lon: number;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
