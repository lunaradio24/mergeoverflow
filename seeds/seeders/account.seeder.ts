import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/account.seed.constant';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Account } from '../../src/auth/entities/account.entity';

export default class AccountSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const accountFactory = factoryManager.get(Account);
    await accountFactory.saveMany(NUM_CREATING_ACCOUNTS);
  }
}
