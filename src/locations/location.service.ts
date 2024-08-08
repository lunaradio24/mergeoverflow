import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 지구의 반지름 (단위: km)
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon1 - lon2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 두 지점 간의 거리 (단위: km)
  }

  async addLocation(userId: number, latitude: number, longitude: number): Promise<Location> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // 기존 위치 정보가 있는지 확인
    let location = await this.locationRepository.findOne({ where: { userId } });

    if (location) {
      // 기존 위치 정보 업데이트
      location.latitude = latitude;
      location.longitude = longitude;
    } else {
      // 새로운 위치 정보 생성
      location = this.locationRepository.create({ user, latitude, longitude });
    }

    return await this.locationRepository.save(location);
  }

  async getLocationByUserId(userId: number): Promise<Location> {
    return this.locationRepository.findOne({ where: { userId } });
  }

  // 거리 계산 테스트를 위한 메서드 추가
  async testCalculateDistance(userId1: number, userId2: number): Promise<number> {
    const location1 = await this.locationRepository.findOne({ where: { user: { id: userId1 } } });
    const location2 = await this.locationRepository.findOne({ where: { user: { id: userId2 } } });

    if (!location1 || !location2) {
      throw new Error('One or both users not found');
    }

    const distance = this.calculateDistance(
      location1.latitude,
      location1.longitude,
      location2.latitude,
      location2.longitude,
    );

    return distance;
  }
}
