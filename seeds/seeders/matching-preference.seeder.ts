import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MatchingPreferences } from 'src/matchings/entities/matching-preferences.entity';
import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/account.seed.constant';

export default class MatchingPreferenceSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const matchingPreferenceRepository = dataSource.getRepository(MatchingPreferences);

    // 먼저 생성된 User 데이터를 내림차순으로 정렬하여 상위 {numNewAccounts}개를 가져온다.
    const newUsers = await userRepository.find({
      order: { createdAt: 'DESC' },
      take: NUM_CREATING_ACCOUNTS,
    });

    // 가져온 데이터를 다시 오름차순으로 정렬
    newUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // 생성된 User 데이터에 따라 Matching-Preferences 데이터를 생성
    const matchingPreferenceFactory = factoryManager.get(MatchingPreferences);

    await Promise.all(
      newUsers.map(async (user) => {
        try {
          const matchingPreferences = await matchingPreferenceFactory.make();
          matchingPreferences.userId = user.id;
          await matchingPreferenceFactory.save(matchingPreferences);
        } catch (error) {
          console.error(`Failed to save matching-preferences of user: ${user.id}`, error);
        }
      }),
    );
  }
}
