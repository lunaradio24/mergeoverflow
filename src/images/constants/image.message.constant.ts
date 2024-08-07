import { MAX_NUM_IMAGES } from './image.constant';

export const IMAGE_MESSAGES = {
  CREATE: {
    FAILURE: {
      UPPER_LIMIT: `이미지 URL은 최대 ${MAX_NUM_IMAGES}개까지 입력 가능합니다.`,
    },
  },
};
