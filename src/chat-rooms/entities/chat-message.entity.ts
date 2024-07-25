import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'chat_messages' })
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  roomId: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  senderId: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  text: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: ChatRoom;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
  sender: User;
}
