import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Account } from 'src/auth/entities/account.entity';
import { hashSync } from 'bcrypt';
import { hashRounds } from 'seeds/constants/seeding-account.constant';

export const accountFactory = setSeederFactory(Account, (faker: Faker) => {
  const account = new Account();
  account.password = hashSync('Test1234!', hashRounds);
  account.phoneNum = `010-${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`;

  return account;
});
