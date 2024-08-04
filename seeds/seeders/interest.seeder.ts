import { Interest } from 'src/interests/entities/interest.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class InterestSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const interestRepository = dataSource.getRepository(Interest);
    const numExistingInterests = await interestRepository.count();
    if (numExistingInterests === 0) {
      const interests = [
        { interestName: '축구' },
        { interestName: '농구' },
        { interestName: '야구' },
        { interestName: '수영' },
        { interestName: '테니스' },
        { interestName: '연극' },
        { interestName: '자전거' },
        { interestName: 'F1' },
        { interestName: '격투기' },
        { interestName: '미식축구' },
        { interestName: '독서' },
        { interestName: '영화' },
        { interestName: '악기' },
        { interestName: '춤' },
        { interestName: '유튜브' },
        { interestName: '헬스' },
        { interestName: '요리' },
        { interestName: '클라이밍' },
        { interestName: '패션' },
        { interestName: '글쓰기' },
        { interestName: '요가' },
        { interestName: '노래' },
        { interestName: '게임' },
        { interestName: '아이돌' },
        { interestName: '주식' },
        { interestName: '런닝' },
        { interestName: '맛집' },
        { interestName: '여행' },
        { interestName: '부동산' },
        { interestName: 'null' },
      ];
      await interestRepository.save(interests);
    }
  }
}
