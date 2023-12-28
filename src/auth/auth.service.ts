import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignUpDto, SignInDto } from './dto';
import { UsersService } from '../users/users.service';
import { IJwtPayload, IToken } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IToken> {
    const user = await this.usersService.createUser(signUpDto);
    return { token: this.getJwtToken({ _id: user._id }) };
  }

  async signIn(signInDto: SignInDto): Promise<IToken> {
    const { username, password } = signInDto;

    try {
      const user = await this.usersService.findUserByUsername(username);

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException(`Credentials are not valid`);
      }

      if (!user.active) {
        throw new UnauthorizedException(`Credentials are not valid`);
      }

      return { token: this.getJwtToken({ _id: user._id }) };
    } catch (error: unknown) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  private getJwtToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
