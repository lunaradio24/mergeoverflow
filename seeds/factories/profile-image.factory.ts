import { Faker } from '@faker-js/faker';
import { ProfileImage } from 'src/users/entities/profile-image.entity';
import { setSeederFactory } from 'typeorm-extension';

export const profileImageFactory = setSeederFactory(ProfileImage, (faker: Faker) => {
  const profileImage = new ProfileImage();
  profileImage.image = faker.image.avatar();

  return profileImage;
});
