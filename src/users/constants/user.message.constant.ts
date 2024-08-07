export const USER_MESSAGES = {
  READ_MY_PROFILE: {
    SUCCEED: '내 정보 조회에 성공했습니다.',
  },
  UPDATE_MY_PROFILE: {
    SUCCEED: '내 정보 수정에 성공했습니다.',
  },
  UPDATE_PASSWORD: {
    SUCCEED: '비밀번호 수정에 성공했습니다.',
    FAILURE: {
      WRONG_PW: '현재 비밀번호와 일치하지 않습니다.',
      NOT_MATCHED: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.',
    },
  },
  FIND: {
    ONE: {
      SUCCEED: '유저 정보 조회에 성공했습니다.',
      FAILURE: {
        NOT_FOUND: '존재하지 않는 유저입니다.',
      },
    },
    MANY: {
      SUCCEED: '유저 정보 조회에 성공했습니다.',
    },
  },
  NICKNAME: {
    DUPLICATE: '이미 존재하는 닉네임입니다.',
  },
};
