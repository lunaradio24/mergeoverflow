import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Heart } from 'src/matchings/entities/heart.entity';
import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/account.seed.constant';

export default class HeartSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const heartRepository = dataSource.getRepository(Heart);

    // 먼저 생성된 User 데이터를 내림차순으로 정렬하여 상위 {numNewAccounts}개를 가져온다.
    const newUsers = await userRepository.find({
      order: { createdAt: 'DESC' },
      take: NUM_CREATING_ACCOUNTS,
    });

    // 가져온 데이터를 다시 오름차순으로 정렬
    newUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // 생성된 User 데이터에 따라 UserToInterest 데이터를 생성
    await Promise.all(
      newUsers.map(async (user) => {
        const hearts = new Heart();
        hearts.userId = user.id;
        await heartRepository.save(hearts);
      }),
    );
  }
}
