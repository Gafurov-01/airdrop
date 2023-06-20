import { Injectable } from '@nestjs/common'
import { compare, genSalt, hash } from 'bcrypt'

@Injectable()
export class CryptoService {
  public async hash(data: string) {
    return await hash(data, await genSalt())
  }

  public async compare(data: string, encrypted: string) {
    return await compare(data, encrypted)
  }
}
