import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { IToken } from './interfaces';
import { User } from '../users/schemas/user.schema';
import { Auth, GetUser } from './decorators';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<IToken> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<IToken> {
    return await this.authService.signIn(signInDto);
  }

  @Get('verifytoken')
  @Auth()
  verifyToken(@GetUser() user: User): User {
    return user;
  }
}
