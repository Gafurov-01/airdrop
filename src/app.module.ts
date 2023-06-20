import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { EmailModule } from './email/email.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [AuthModule, UserModule, EmailModule, CryptoModule],
})
export class AppModule {}
