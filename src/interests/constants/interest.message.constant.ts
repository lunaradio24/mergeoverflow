import { MAX_NUM_INTERESTS, MIN_NUM_INTERESTS } from './interest.constant';

export const INTEREST_MESSAGES = {
  COMMON: {
    DUPLICATE: '이미 존재하는 관심사 이름입니다.',
  },
  CREATE: {
    SUCCEED: '관심사 등록에 성공했습니다.',
    FAILURE: {
      UPPER_LIMIT: `관심사는 최대 ${MAX_NUM_INTERESTS}개까지 선택할 수 있습니다.`,
      LOWER_LIMIT: `관심사는 최소 ${MIN_NUM_INTERESTS}개 이상 선택해야 합니다.`,
    },
  },
  READ_ALL: {
    SUCCEED: '관심사 전체 목록 조회를 완료했습니다.',
  },
  READ_ONE: {
    SUCCEED: '관심사 상세 조회를 완료했습니다.',
    FAILURE: {
      NOT_FOUND: '존재하지 않는 관심사입니다.',
    },
  },
  UPDATE: {
    SUCCEED: '관심사 수정을 완료했습니다.',
  },
  DELETE: {
    SUCCEED: '관심사 삭제를 완료했습니다.',
  },
};
