import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Location } from 'src/locations/entities/location.entity';
import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/account.seed.constant';

export default class LocationSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const locationRepository = dataSource.getRepository(Location);

    // 먼저 생성된 User 데이터를 내림차순으로 정렬하여 상위 {numNewAccounts}개를 가져온다.
    const newUsers = await userRepository.find({
      order: { createdAt: 'DESC' },
      take: NUM_CREATING_ACCOUNTS,
    });

    // 가져온 데이터를 다시 오름차순으로 정렬
    newUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // 생성된 User 데이터에 따라 Location 데이터를 생성
    const locationFactory = factoryManager.get(Location);

    await Promise.all(
      newUsers.map(async (user) => {
        try {
          const location = await locationFactory.make();
          location.userId = user.id;
          await locationRepository.save(location);
        } catch (error) {
          console.error(`Failed to save location of user: ${user.id}`, error);
        }
      }),
    );
  }
}
