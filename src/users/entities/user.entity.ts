import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../types/Gender.type';
import { Region } from '../types/region.type';
import { Pet } from '../types/pet.type';
import { BodyShape } from '../types/bodyshape.type';
import { Mbti } from '../types/mbti.type';
import { Religion } from '../types/religion.type';
import { Frequency } from '../types/frequency.type';
import { Interest } from './interest.entity';
import { UserToInterest } from './user-to-interest.entity';
import { UserToTech } from './user-to-tech.entity';
import { ProfileImage } from './profile-image.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Matching } from '../../matchings/entities/matching.entity';
import { Heart } from '../../matchings/entities/heart.entity';
import { ChatMessage } from '../../chat-rooms/entities/chat-message.entity';
import { ChatRoom } from '../../chat-rooms/entities/chat-room.entity';
import { Account } from '../../auth/entities/account.entity';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  accountId: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'date' })
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  nickname: string;

  @IsInt()
  @Column({ type: 'int', default: 0 })
  codingLevel: number;

  @IsNotEmpty()
  @IsEnum(Frequency)
  @Column({ type: 'enum', enum: Frequency })
  smokingFreq: Frequency;

  @IsNotEmpty()
  @IsEnum(Frequency)
  @Column({ type: 'enum', enum: Frequency })
  drinkingFreq: Frequency;

  @IsNotEmpty()
  @IsEnum(Religion)
  @Column({ type: 'enum', enum: Religion })
  religion: Religion;

  @IsNotEmpty()
  @IsEnum(Mbti)
  @Column({ type: 'enum', enum: Mbti })
  mbti: Mbti;

  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'float' })
  height: number;

  @IsNotEmpty()
  @IsEnum(BodyShape)
  @Column({ type: 'enum', enum: BodyShape })
  bodyShape: BodyShape;

  @IsNotEmpty()
  @IsEnum(Pet)
  @Column({ type: 'enum', enum: Pet })
  pet: Pet;

  @IsNotEmpty()
  @IsEnum(Region)
  @Column({ type: 'enum', enum: Region })
  region: Region;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Interest)
  @JoinTable()
  Interests: Interest[];

  @OneToMany(() => UserToInterest, (userToInterest) => userToInterest.user)
  userToInterests: UserToInterest[];

  @OneToMany(() => UserToTech, (userToTech) => userToTech.user)
  userToTechs: UserToTech[];

  @OneToMany(() => ProfileImage, (image) => image.user)
  images: ProfileImage[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Matching, (matching) => matching.user)
  matchings: Matching[];

  @OneToOne(() => Heart, (heart) => heart.user)
  hearts: Heart;

  @OneToMany(() => ChatMessage, (message) => message.sender)
  messages: ChatMessage[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user1)
  chatRoomsAsUser1: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user2)
  chatRoomsAsUser2: ChatRoom[];

  @OneToOne(() => Account, (account) => account.user)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;
}
