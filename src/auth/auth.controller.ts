import { Controller, Post, Body, UseGuards, Get, Req, HttpStatus, Res, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
import { AUTH_MESSAGES } from './constants/auth.message.constant';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { SendSmsCodeDto } from './dto/send-sms-code.dto';
import { LocalSignUpDto } from './dto/local-sign-up.dto';
import { SocialSignUpDto } from './dto/social-sign-up.dto';
import { VerifySmsCodeDto } from './dto/verify-sms-code.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { GithubAuthGuard } from './guards/github.guard';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { TokensRO } from './ro/tokens.ro';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**휴대폰 인증 코드 SMS 발송 */
  @Post('sms/send')
  async sendSmsForVerification(@Body() { phoneNum }: SendSmsCodeDto): Promise<ApiResponse<boolean>> {
    const isSuccess = await this.authService.sendSmsForVerification(phoneNum);
    return {
      statusCode: HttpStatus.OK,
      message: AUTH_MESSAGES.SMS_SEND.SUCCEED,
      data: isSuccess,
    };
  }

  /**휴대폰 인증 코드 확인 */
  @Post('sms/verify')
  async verifyCode(@Body() { phoneNum, code }: VerifySmsCodeDto): Promise<ApiResponse<boolean>> {
    const isVerifiedCode = await this.authService.verifyCode(phoneNum, code);
    return {
      statusCode: HttpStatus.OK,
      message: AUTH_MESSAGES.SMS_VERIFY.SUCCEED,
      data: isVerifiedCode,
    };
  }

  /**회원가입 */
  @Post('sign-up/local')
  async signUp(@Body() signUpDto: LocalSignUpDto): Promise<ApiResponse<boolean>> {
    const isSuccess = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: AUTH_MESSAGES.SIGN_UP.SUCCEED,
      data: isSuccess,
    };
  }

  @Get('sign-in/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {}

  @Get('sign-in/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: any): Promise<void> {
    const socialLoginDto = req.user;
    const { tokens, provider, providerId } = await this.authService.socialSignIn(socialLoginDto);

    let redirectUrl: string;

    if (tokens && tokens.accessToken) {
      redirectUrl = `https://mergeoverflow.shop/google-callback?token=${tokens.accessToken}&provider=${provider}&providerId=${providerId}`;
    } else {
      redirectUrl = `https://mergeoverflow.shop/google-callback?provider=${provider}&providerId=${providerId}`;
    }
    res.redirect(redirectUrl);
  }

  @Get('sign-in/github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Req() req: Request) {}

  @Get('sign-in/github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req: any, @Res() res: any): Promise<void> {
    const socialLoginDto = req.user;
    const { tokens, provider, providerId } = await this.authService.socialSignIn(socialLoginDto);

    let redirectUrl: string;

    if (tokens && tokens.accessToken) {
      redirectUrl = `https://mergeoverflow.shop/github-callback?token=${tokens.accessToken}&provider=${provider}&providerId=${providerId}`;
    } else {
      redirectUrl = `https://mergeoverflow.shop/github-callback?provider=${provider}&providerId=${providerId}`;
    }
    res.redirect(redirectUrl);
  }

  @Post('sign-up/social')
  async socialSignUp(
    @Body() socialSignUpDto: SocialSignUpDto,
    @Query('provider') provider: string,
    @Query('providerId') providerId: string,
  ): Promise<ApiResponse<boolean>> {
    const newUser = await this.authService.socialSignUp(socialSignUpDto, provider, providerId);
    return {
      statusCode: HttpStatus.CREATED,
      message: AUTH_MESSAGES.SIGN_UP.SUCCEED,
      data: newUser,
    };
  }

  /**로그인 */
  @Post('sign-in/local')
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() req: any): Promise<ApiResponse<TokensRO>> {
    const localPayload = req.user;
    const tokens = await this.authService.signIn(localPayload);
    return {
      statusCode: HttpStatus.OK,
      message: AUTH_MESSAGES.SIGN_IN.SUCCEED,
      data: tokens,
    };
  }

  /**로그아웃 */
  @Post('sign-out')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  async signOut(@UserInfo() user: User): Promise<ApiResponse<boolean>> {
    const userId = user.id;
    await this.authService.signOut(userId);
    return {
      statusCode: HttpStatus.OK,
      message: AUTH_MESSAGES.SIGN_OUT.SUCCEED,
      data: true,
    };
  }

  /** 토큰 재발급 */
  @Post('tokens/renew')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  async renewTokens(@Req() req: any): Promise<ApiResponse<TokensRO>> {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const tokens = await this.authService.renewTokens(refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: AUTH_MESSAGES.RENEW_TOKENS.SUCCEED,
      data: tokens,
    };
  }
}
