import { Faker } from '@faker-js/faker';
import { Location } from 'src/locations/entities/location.entity';
import { setSeederFactory } from 'typeorm-extension';

export const locationFactory = setSeederFactory(Location, (faker: Faker) => {
  const location = new Location();
  location.latitude = faker.location.latitude({ max: 37.7596, min: 35.1731, precision: 4 });
  location.longitude = faker.location.longitude({ max: 129.0714, min: 126.7778, precision: 4 });

  return location;
});
