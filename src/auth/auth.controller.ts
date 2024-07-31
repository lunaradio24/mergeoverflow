import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { VerificationRequestDto } from './dto/verification-request.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**sms 인증 코드 발송 */
  @Post('sms/send')
  async sendSmsForVerification(@Body() verificationRequestDto: VerificationRequestDto) {
    const { phoneNum } = verificationRequestDto;
    const isSuccess = await this.authService.sendSmsForVerification(phoneNum);
    return {
      message: 'sms 전송에 성공했습니다.',
      data: { isSuccess },
    };
  }

  /**sms 인증 코드 확인 */
  @Post('sms/verify')
  async verifyCode(@Body() { phoneNum, code }: { phoneNum: string; code: string }) {
    const isVerifiedCode = await this.authService.verifyCode(phoneNum, code);
    return {
      message: 'sms 인증에 성공했습니다.',
      data: { isVerifiedCode },
    };
  }

  /**회원가입 */
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const newUser = await this.authService.signUp(signUpDto);
    return {
      message: '회원가입을 완료했습니다.',
      data: newUser,
    };
  }

  /**로그인 */
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req: any) {
    const { id: userId, phoneNum } = req.user;
    const tokens = await this.authService.signIn(userId, phoneNum);
    return {
      message: '로그인에 성공했습니다.',
      data: tokens,
    };
  }

  /**로그아웃 */
  @Post('sign-out')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  async signOut(@Request() req: any) {
    await this.authService.signOut(req.user.id);
    return {
      message: '로그아웃에 성공했습니다.',
    };
  }

  /** 토큰 재발급 */
  @Post('tokens/renew')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  async renewTokens(@Request() req: any) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const tokens = await this.authService.renewTokens(refreshToken);
    return {
      message: '토큰 재발급에 성공했습니다.',
      data: tokens,
    };
  }
}
