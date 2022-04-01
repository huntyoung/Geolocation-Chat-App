import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat_room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  chatRoomId: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  userName: string;

  @Column()
  content: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;
}
