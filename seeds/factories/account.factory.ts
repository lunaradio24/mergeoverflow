import { Faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';
import { HASH_ROUNDS } from 'seeds/constants/account.seed.constant';
import { Account } from 'src/auth/entities/account.entity';
import { setSeederFactory } from 'typeorm-extension';

export const accountFactory = setSeederFactory(Account, (faker: Faker) => {
  const account = new Account();
  account.password = hashSync('Test1234!', HASH_ROUNDS);
  account.phoneNum = `010-${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`;

  return account;
});
