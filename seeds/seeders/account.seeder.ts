import { numCreatingAccounts } from 'seeds/constants/seeding-account.constant';
import { Account } from '../../src/auth/entities/account.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class AccountSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const accountFactory = factoryManager.get(Account);
    await accountFactory.saveMany(numCreatingAccounts);
  }
}
