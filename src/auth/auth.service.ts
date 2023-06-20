import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { Response } from 'express'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dtos/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async register(authDto: AuthDto) {
    const user = await this.userService.getByEmail(authDto.email)
    if (!user) {
      return await this.userService.create(authDto)
    } else {
      throw new ForbiddenException('Ops! This user already exists')
    }
  }

  public async login(authDto: AuthDto) {
    const user = await this.userService.getByEmail(authDto.email)

    if (user) {
      const isPasswordRight = await this.userService.comparePassword(
        authDto.password,
        user.password,
      )

      if (isPasswordRight) {
        return user
      } else {
        throw new BadRequestException('Ops! Check your password')
      }
    } else {
      throw new BadRequestException("Ops! This user doesn't exist")
    }
  }

  public async confirmEmail(id: string) {
    return await this.userService.markAsEmailConfirmed(id)
  }

  public async issueTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          sub: user.id,
        },
        { expiresIn: '30m' },
      ),
      await this.jwtService.signAsync(
        {
          sub: user.id,
        },
        { expiresIn: '7d' },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  public setCookie(name: string, value: string, response: Response) {
    response.cookie(name, value, {
      domain: this.configService.get('DOMAIN'),
      maxAge: 604800000,
      sameSite: 'none',
      httpOnly: true,
    })
  }
}
