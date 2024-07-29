import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../src/users/entities/user.entity';
import { Faker } from '@faker-js/faker';
import { Gender } from '../../src/users/types/Gender.type';
import { Frequency } from '../../src/users/types/frequency.type';
import { Religion } from '../../src/users/types/religion.type';
import { Mbti } from '../../src/users/types/mbti.type';
import { BodyShape } from '../../src/users/types/bodyshape.type';
import { Pet } from '../../src/users/types/pet.type';
import { Region } from '../../src/users/types/region.type';

export const userFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.birthDate = faker.date.birthdate({ min: 1980, max: 2007, mode: 'year' }).toISOString().slice(0, 10);
  user.gender = Gender[faker.number.int(1)];
  user.nickname = faker.person.firstName();
  user.smokingFreq = Frequency[faker.number.int(2)];
  user.drinkingFreq = Frequency[faker.number.int(2)];
  user.religion = Religion[faker.number.int(4)];
  user.mbti = Mbti[faker.number.int(15)];
  user.height = faker.number.float({ min: 50.0, max: 300.0 });
  user.bodyShape = BodyShape[faker.number.int(3)];
  user.pet = Pet[faker.number.int(4)];
  user.region = Region[faker.number.int(16)];
  user.bio = faker.lorem.sentence();

  return user;
});
