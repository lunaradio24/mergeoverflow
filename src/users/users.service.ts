import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateDetailUserDto } from './dto/create-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from './dto/interest.dto';
import { CreateTechDto } from './dto/tech.dto';
import { Tech } from './entities/tech.entity';

@Injectable()
export class UsersService {
  // Repository 주입
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Interest)
  private readonly interestRepository: Repository<Interest>;
  @InjectRepository(Tech)
  private readonly techRepository: Repository<Tech>;

  // 회원 변경 불가한 정보 데이터에 저장
  async create(createUserDto: CreateUserDto) {
    return;
  }

  // 회원 변경 가능한 정보 데이터에 저장 // 영진님 쓰세요.
  async createDetailUser(createDetailUserDto: CreateDetailUserDto) {
    const data = { ...createDetailUserDto };

    await this.userRepository.save(data);

    return data;
  }

  // 회원 관심사 저장
  async createUserInterest(createInterestDto: CreateInterestDto) {
    const data = { ...createInterestDto };

    await this.interestRepository.save(data);

    return data;
  }

  // 회원 기술사 저장
  async createUserTech(createTechDto: CreateTechDto) {
    const data = { ...createTechDto };

    await this.techRepository.save(data);

    return data;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
