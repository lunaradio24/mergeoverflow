import { Faker } from '@faker-js/faker';
import { MAX_BIRTH_YEAR, MAX_HEIGHT, MIN_BIRTH_YEAR, MIN_HEIGHT } from 'seeds/constants/user.seed.constant';
import { setSeederFactory } from 'typeorm-extension';

import { User } from '../../src/users/entities/user.entity';
import { Gender } from '../../src/users/types/gender.type';
import { BodyShape } from '../../src/users/types/bodyshape.type';
import { Frequency } from '../../src/users/types/frequency.type';
import { Mbti } from '../../src/users/types/mbti.type';
import { Pet } from '../../src/users/types/pet.type';
import { Region } from '../../src/users/types/region.type';
import { Religion } from '../../src/users/types/religion.type';

export const userFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.birthDate = faker.date
    .birthdate({ min: MIN_BIRTH_YEAR, max: MAX_BIRTH_YEAR, mode: 'year' })
    .toISOString()
    .slice(0, 10);
  user.gender = faker.helpers.enumValue(Gender);
  user.nickname = faker.person.firstName();
  user.smokingFreq = faker.helpers.enumValue(Frequency);
  user.drinkingFreq = faker.helpers.enumValue(Frequency);
  user.religion = faker.helpers.enumValue(Religion);
  user.mbti = faker.helpers.enumValue(Mbti);
  user.height = faker.number.float({ min: MIN_HEIGHT, max: MAX_HEIGHT });
  user.bodyShape = faker.helpers.enumValue(BodyShape);
  user.pet = faker.helpers.enumValue(Pet);
  user.region = faker.helpers.enumValue(Region);
  user.bio = faker.lorem.sentence();

  return user;
});
