import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt } from 'class-validator';

// 내 정보 수정에서도 쓰이고 회원가입에서도 쓰이고
export class UserToInterestDto {
  @IsArray()
  @ArrayMinSize(1, { message: '관심사를 최소 1개 선택해주세요.' })
  @ArrayMaxSize(5, { message: '관심사는 최대 5개까지 선택할 수 있습니다.' })
  @IsInt()
  interestIds: number[];
}

// each: true는 배열 속에 들어가는 데이터들을 하나 하나 enum 값에 있는 데이터가 맞는지 확인한다는 소리.
// message: '유효하지 않은 관심사입니다.' 는 만약 enum 값에 없는 데이터를 입력하면 에러 시 나오는 소리. but 여기서는 없을 듯.
// 왜냐? 우리는 따로 따로 선택지를 만들어서 넣을 것이니까
