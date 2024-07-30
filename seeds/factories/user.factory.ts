import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../src/users/entities/user.entity';
import { Faker } from '@faker-js/faker';
import { getRandomInt } from 'src/utils/functions/get-random-int.function';
import { Gender } from '../../src/users/types/Gender.type';
import { Frequency } from '../../src/users/types/frequency.type';
import { Religion } from '../../src/users/types/religion.type';
import { Mbti } from '../../src/users/types/mbti.type';
import { BodyShape } from '../../src/users/types/bodyshape.type';
import { Pet } from '../../src/users/types/pet.type';
import { Region } from '../../src/users/types/region.type';
import { maxBirthYear, maxHeight, minBirthYear, minHeight } from 'seeds/constants/seeding-user.constant';

export const userFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.birthDate = faker.date
    .birthdate({ min: minBirthYear, max: maxBirthYear, mode: 'year' })
    .toISOString()
    .slice(0, 10);
  user.gender = faker.helpers.enumValue(Gender);
  user.nickname = faker.person.firstName();
  user.smokingFreq = faker.helpers.enumValue(Frequency);
  user.drinkingFreq = faker.helpers.enumValue(Frequency);
  user.religion = faker.helpers.enumValue(Religion);
  user.mbti = faker.helpers.enumValue(Mbti);
  user.height = faker.number.float({ min: minHeight, max: maxHeight });
  user.bodyShape = faker.helpers.enumValue(BodyShape);
  user.pet = faker.helpers.enumValue(Pet);
  user.region = faker.helpers.enumValue(Region);
  user.bio = faker.lorem.sentence();

  return user;
});
