import { Injectable } from '@nestjs/common'
import { AuthDto } from 'src/auth/dtos/auth.dto'
import { CryptoService } from 'src/crypto/crypto.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  public async create(authDto: AuthDto) {
    return await this.prisma.user.create({
      data: {
        name: authDto.name,
        email: authDto.email,
        password: await this.cryptoService.hash(authDto.password),
      },
    })
  }

  public async markAsEmailConfirmed(id: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { isEmailConfirmed: true },
    })
  }

  public async comparePassword(password: string, hashedPassword: string) {
    return await this.cryptoService.compare(password, hashedPassword)
  }

  public async getById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  public async getByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } })
  }
}
