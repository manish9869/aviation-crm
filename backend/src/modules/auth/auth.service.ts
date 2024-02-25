import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(1);

    console.log(pass, username);
    if ('test' !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { test: 'test' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
