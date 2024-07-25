import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { IsInt, IsNotEmpty } from 'class-validator';

Entity({ name: 'chat_rooms' });
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  user1Id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  user2Id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.chatRoomsAsUser1)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.chatRoomsAsUser2)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
