import { MAX_NUM_TECHS, MIN_NUM_TECHS } from './tech.constant';

export const TECH_MESSAGES = {
  CREATE: {
    SUCCEED: '',
    FAILURE: {
      UPPER_LIMIT: `관심사는 최대 ${MAX_NUM_TECHS}개까지 선택할 수 있습니다.`,
      LOWER_LIMIT: `관심사는 최소 ${MIN_NUM_TECHS}개 이상 선택해야 합니다.`,
    },
  },
};
