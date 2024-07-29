import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Account } from 'src/auth/entities/account.entity';
import { hashSync } from 'bcrypt';

export const accountFactory = setSeederFactory(Account, (faker: Faker) => {
  const account = new Account();
  account.password = hashSync('test1234!', 10);
  account.phoneNum = `010-${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`;

  return account;
});
