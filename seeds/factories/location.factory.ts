import { Faker } from '@faker-js/faker';
import {
  DECIMAL_PRECISION,
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
} from 'seeds/constants/location.seed.constant';
import { Location } from 'src/locations/entities/location.entity';
import { setSeederFactory } from 'typeorm-extension';

export const locationFactory = setSeederFactory(Location, (faker: Faker) => {
  const location = new Location();
  location.latitude = faker.location.latitude({ max: MAX_LATITUDE, min: MIN_LATITUDE, precision: DECIMAL_PRECISION });
  location.longitude = faker.location.longitude({
    max: MAX_LONGITUDE,
    min: MIN_LONGITUDE,
    precision: DECIMAL_PRECISION,
  });

  return location;
});
