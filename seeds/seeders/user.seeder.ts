import { Account } from 'src/auth/entities/account.entity';
import { User } from '../../src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/account.seed.constant';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const accountRepository = dataSource.getRepository(Account);

    // 먼저 생성된 Account 데이터를 내림차순으로 정렬하여 상위 {numNewAccounts}개를 가져온다.
    const newAccounts = await accountRepository.find({
      order: { createdAt: 'DESC' },
      take: NUM_CREATING_ACCOUNTS,
    });

    // 가져온 데이터를 다시 오름차순으로 정렬
    newAccounts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // 생성된 Account 데이터에 따라 User 데이터를 생성
    const userFactory = factoryManager.get(User);

    for (let i = 0; i < NUM_CREATING_ACCOUNTS; i++) {
      const newUser = await userFactory.make();
      newUser.accountId = newAccounts[i].id; // 생성된 Account의 id를 User의 accountId로 설정
      await userRepository.save(newUser);
    }
  }
}
