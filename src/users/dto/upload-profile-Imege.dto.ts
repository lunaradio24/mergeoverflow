import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateProfileImageDto {
  /**
   * 프로필 이미지
   * @example "conan.png"
   */
  @IsNotEmpty({ message: '이미지를 넣어주세요' })
  @IsString()
  @IsUrl({ allow_underscores: true, allow_trailing_dot: true, allow_protocol_relative_urls: true })
  image: string;
}
