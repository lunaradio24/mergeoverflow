import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../src/users/entities/user.entity';

export class UsersSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // await userRepository.insertMany(users);
  }
}
