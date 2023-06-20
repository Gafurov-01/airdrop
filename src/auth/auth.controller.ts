import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { EmailService } from 'src/email/email.service'
import { AuthService } from './auth.service'
import { CookieName } from './constants/cookie-name'
import { AuthDto } from './dtos/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(@Body() authDto: AuthDto) {
    const newUser = await this.authService.register(authDto)
    await this.emailService.sendEmailConfirmation(newUser)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(authDto)

    const tokens = await this.authService.issueTokens(user)
    this.authService.setCookie(
      CookieName.REFRESH_TOKEN,
      tokens.refreshToken,
      response,
    )

    return {
      user,
      accessToken: tokens.accessToken,
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch('confirm-email/:id')
  public async confirmEmail(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.confirmEmail(id)

    const tokens = await this.authService.issueTokens(user)
    this.authService.setCookie(
      CookieName.REFRESH_TOKEN,
      tokens.refreshToken,
      response,
    )

    return {
      user,
      accessToken: tokens.accessToken,
    }
  }
}
