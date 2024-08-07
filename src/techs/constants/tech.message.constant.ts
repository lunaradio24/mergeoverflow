import { MAX_NUM_TECHS, MIN_NUM_TECHS } from './tech.constant';

export const TECH_MESSAGES = {
  COMMON: {
    DUPLICATE: '이미 존재하는 기술스택 이름입니다.',
  },
  CREATE: {
    SUCCEED: '기술스택 등록에 성공했습니다.',
    FAILURE: {
      UPPER_LIMIT: `기술스택은 최대 ${MAX_NUM_TECHS}개까지 선택할 수 있습니다.`,
      LOWER_LIMIT: `기술스택은 최소 ${MIN_NUM_TECHS}개 이상 선택해야 합니다.`,
    },
  },
  READ_ALL: {
    SUCCEED: '기술스택 전체 목록 조회를 완료했습니다.',
  },
  READ_ONE: {
    SUCCEED: '기술스택 상세 조회를 완료했습니다.',
    FAILURE: {
      NOT_FOUND: '존재하지 않는 기술스택입니다.',
    },
  },
  UPDATE: {
    SUCCEED: '기술스택 수정을 완료했습니다.',
  },
  DELETE: {
    SUCCEED: '기술스택 삭제를 완료했습니다.',
  },
};
