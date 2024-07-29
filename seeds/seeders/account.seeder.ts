// import { Account } from 'src/auth/entities/account.entity';
// import { DataSource } from 'typeorm';
// import { Seeder, SeederFactoryManager } from 'typeorm-extension';

// export default class AccountSeeder implements Seeder {
//   public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
//     const accountRepository = dataSource.getRepository(Account);

//     const accountFactory = factoryManager.get(Account);
//     const numNewAccounts = 10;
//     const newAccounts = await accountFactory.saveMany(numNewAccounts);
//   }
// }

import { Account } from 'src/auth/entities/account.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from 'src/auth/types/role.type';
import { hash } from 'bcrypt';

export default class AccountSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const accountRepository = dataSource.getRepository(Account);

    await accountRepository.save([
      {
        password: await hash('admin1234!', 10),
        phoneNum: '010-0000-0001',
        role: Role.ADMIN,
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0002',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0003',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0004',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0005',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0006',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0007',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0008',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0009',
      },
      {
        password: await hash('test1234!', 10),
        phoneNum: '010-0000-0010',
      },
    ]);
  }
}
