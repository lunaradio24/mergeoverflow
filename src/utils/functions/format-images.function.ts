import { ProfileImage } from 'src/images/entities/profile-image.entity';

export const imageFlatter = (images: ProfileImage[]) => {
  return images.map((image) => image.imageUrl);
};
