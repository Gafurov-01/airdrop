import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class AuthDto {
  @IsOptional()
  name?: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
