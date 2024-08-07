import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from './auth.constant';

export const AUTH_MESSAGES = {
  COMMON: {
    PHONE_NUM: {
      REQUIRED: '휴대폰 번호를 입력해 주세요.',
      INVALID_FORMAT: '휴대폰 번호 형식이 올바르지 않습니다.',
      DUPLICATED: '이미 가입된 번호입니다.',
    },
    PASSWORD: {
      REQUIRED: '비밀번호를 입력해 주세요.',
      MIN_LENGTH: `비밀번호는 ${MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
      MAX_LENGTH: `비밀번호는 ${MAX_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
    },
    PASSWORD_CONFIRM: {
      REQUIRED: '비밀번호 확인을 입력해 주세요.',
      NOT_MATCHED_WITH_PASSWORD: '입력 한 두 비밀번호가 일치하지 않습니다.',
    },
    NAME: {
      REQUIRED: '이름을 입력해 주세요.',
    },
    UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
    JWT: {
      NO_TOKEN: '인증 정보가 없습니다.',
      NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
      EXPIRED: '인증 정보가 만료되었습니다.',
      NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
      INVALID: '인증 정보가 유효하지 않습니다.',
    },
    ROLE: {
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
  },
  SIGN_UP: {
    SUCCEED: '회원가입을 완료했습니다.',
    FAILURE: {
      REQUIRE_SMS_VERIFICATION: '전화번호 인증이 필요합니다.',
    },
  },
  SIGN_IN: {
    SUCCEED: '로그인에 성공했습니다.',
    FAILURE: {
      UNAUTHORIZED: '잘못된 전화번호 또는 비밀번호입니다.',
    },
  },
  SIGN_OUT: {
    SUCCEED: '로그아웃에 성공했습니다.',
    FAILURE: {
      ALREADY_SIGNED_OUT: '이미 로그아웃한 상태입니다.',
    },
  },
  RENEW_TOKENS: {
    SUCCEED: '토큰 재발급에 성공했습니다.',
  },
  SMS_SEND: {
    SUCCEED: 'SMS 인증번호 발송에 성공했습니다.',
    FAILURE: {
      DUPLICATED: '이미 가입된 번호입니다.',
    },
  },
  SMS_VERIFY: {
    SUCCEED: '휴대폰 번호 인증에 성공했습니다.',
    FAILURE: {
      WRONG_CODE: '잘못된 인증번호입니다.',
    },
  },
};
