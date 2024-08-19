import { Faker } from '@faker-js/faker';
import { ProfileImage } from 'src/images/entities/profile-image.entity';
import { setSeederFactory } from 'typeorm-extension';

export const profileImageFactory = setSeederFactory(ProfileImage, (faker: Faker) => {
  const profileImage = new ProfileImage();
  profileImage.imageUrl = faker.image.urlPicsumPhotos();

  return profileImage;
});
