import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../types/gender.type';
import { Region } from '../types/region.type';
import { Pet } from '../types/pet.type';
import { BodyShape } from '../types/bodyshape.type';
import { Mbti } from '../types/mbti.type';
import { Religion } from '../types/religion.type';
import { Frequency } from '../types/frequency.type';
import { UserToInterest } from './user-to-interest.entity';
import { UserToTech } from './user-to-tech.entity';
import { ProfileImage } from '../../images/entities/profile-image.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Matching } from '../../matchings/entities/matching.entity';
import { Heart } from '../../hearts/entities/heart.entity';
import { ChatMessage } from '../../chat-rooms/entities/chat-message.entity';
import { ChatRoom } from '../../chat-rooms/entities/chat-room.entity';
import { Account } from '../../auth/entities/account.entity';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MatchingPreferences } from 'src/matchings/entities/matching-preferences.entity';
import { Location } from 'src/locations/entities/location.entity';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  accountId: number;

  @IsNotEmpty({ message: '생년월일을 입력해주세요.' })
  @IsString()
  @Column({ type: 'date' })
  birthDate: string;

  @IsNotEmpty({ message: '성별을 선택해주세요.' })
  @IsEnum(Gender)
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @IsString()
  @Column({ type: 'varchar' })
  nickname: string;

  @IsInt()
  @Column({ type: 'int', default: 0 })
  codingLevel: number;

  @IsNotEmpty({ message: '흡연 정도를 선택해주세요.' })
  @IsEnum(Frequency)
  @Column({ type: 'enum', enum: Frequency })
  smokingFreq: Frequency;

  @IsNotEmpty({ message: '음주 정도를 선택해주세요.' })
  @IsEnum(Frequency)
  @Column({ type: 'enum', enum: Frequency })
  drinkingFreq: Frequency;

  @IsNotEmpty({ message: '종교를 선택해주세요.' })
  @IsEnum(Religion)
  @Column({ type: 'enum', enum: Religion })
  religion: Religion;

  @IsNotEmpty({ message: 'Mbti를 선택해주세요.' })
  @IsEnum(Mbti)
  @Column({ type: 'enum', enum: Mbti })
  mbti: Mbti;

  @IsNotEmpty({ message: '키를 해주세요.' })
  @IsNumber()
  @Column({ type: 'float' })
  height: number;

  @IsNotEmpty({ message: '체형을 선택해주세요.' })
  @IsEnum(BodyShape)
  @Column({ type: 'enum', enum: BodyShape })
  bodyShape: BodyShape;

  @IsNotEmpty({ message: '반려동물 여부를 선택해주세요.' })
  @IsEnum(Pet)
  @Column({ type: 'enum', enum: Pet })
  pet: Pet;

  @IsNotEmpty({ message: '거주 지역을 선택 해주세요.' })
  @IsEnum(Region)
  @Column({ type: 'enum', enum: Region })
  region: Region;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserToInterest, (userToInterest) => userToInterest.user, { cascade: true })
  userToInterests: UserToInterest[];

  @OneToMany(() => UserToTech, (userToTech) => userToTech.user, { cascade: true })
  userToTechs: UserToTech[];

  @OneToMany(() => ProfileImage, (image) => image.user, { cascade: true })
  images: ProfileImage[];

  @OneToMany(() => Notification, (notification) => notification.user, { cascade: true })
  notifications: Notification[];

  @OneToMany(() => Matching, (matching) => matching.user, { cascade: true })
  matchings: Matching[];

  @OneToOne(() => Heart, (heart) => heart.user, { cascade: true })
  hearts: Heart;

  @OneToMany(() => ChatMessage, (message) => message.sender, { cascade: true })
  messages: ChatMessage[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user1, { cascade: true })
  chatRoomsAsUser1: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user2, { cascade: true })
  chatRoomsAsUser2: ChatRoom[];

  @OneToOne(() => Account, (account) => account.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @OneToOne(() => MatchingPreferences, (matchingPreferences) => matchingPreferences.user, { cascade: true })
  matchingPreferences: MatchingPreferences;

  @OneToOne(() => Location, (location) => location.user, { cascade: true })
  location: Location;
}
