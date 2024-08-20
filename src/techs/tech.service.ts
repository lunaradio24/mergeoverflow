import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TechDto } from './dto/tech.dto';
import { Tech } from './entities/tech.entity';
import { TECH_MESSAGES } from './constants/tech.message.constant';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { TechRO } from './ro/tech.ro';

@Injectable()
export class TechService {
  constructor(
    @InjectRepository(Tech)
    private readonly techRepository: Repository<Tech>,
    @InjectRepository(UserToTech)
    private readonly userToTechRepository: Repository<UserToTech>,
  ) {}

  // 기술 목록 생성
  async create(techDto: TechDto): Promise<boolean> {
    // 이미 존재하는 기술스택 이름인지 확인
    await this.checkDuplicateTechName(techDto.techName);

    // 입력한 tech 저장
    await this.techRepository.save(techDto);
    return true;
  }

  // 기술 ID로 조회
  async findOneById(id: number): Promise<Tech> {
    const tech = await this.techRepository.findOne({ where: { id } });
    if (!tech) {
      throw new NotFoundException(TECH_MESSAGES.READ_ONE.FAILURE.NOT_FOUND);
    }
    return tech;
  }

  // 기술 목록 전체 조회
  async findAll(): Promise<Tech[]> {
    const techList = await this.techRepository.find({ order: { id: 'ASC' } });
    return techList;
  }

  // 유저 기술 목록 조회
  async findUserTechs(userId: number): Promise<TechRO[]> {
    const userToTechs = await this.userToTechRepository.find({
      where: { userId },
      relations: { tech: true },
    });

    const userTechs = userToTechs.map((userToTech) => {
      return {
        techId: userToTech.tech.id,
        techName: userToTech.tech.techName,
      };
    });

    return userTechs;
  }

  // 기술 수정
  async update(id: number, techDto: TechDto): Promise<boolean> {
    // 존재하는 기술 ID인지 확인
    await this.findOneById(id);

    // 이미 존재하는 기술스택 이름인지 확인
    await this.checkDuplicateTechName(techDto.techName);

    // 기술스택 이름 업데이트
    await this.techRepository.update({ id }, techDto);

    return true;
  }

  // 기술 삭제
  async remove(id: number): Promise<boolean> {
    // 존재하는 기술 ID인지 확인
    await this.findOneById(id);

    // 기술스택 삭제
    await this.techRepository.delete(id);

    return true;
  }

  // 이미 존재하는 기술인지 확인
  async checkDuplicateTechName(techName: string): Promise<void> {
    const existingTech = await this.techRepository.findOne({ where: { techName } });
    if (existingTech) {
      throw new ConflictException(TECH_MESSAGES.COMMON.DUPLICATE);
    }
    return;
  }
}
