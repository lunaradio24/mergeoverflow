import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt } from 'class-validator';

// 내 정보 수정에서도 쓰이고 회원가입에서도 쓰이고
export class UserToTechDto {
  @IsArray()
  @ArrayMinSize(1, { message: '기술은 최소 1개 선택해주세요.' })
  @ArrayMaxSize(5, { message: '기술은 최대 5개까지 선택할 수 있습니다.' })
  @IsInt()
  techIds: number[];
}
