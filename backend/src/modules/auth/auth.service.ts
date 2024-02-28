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
    const user = await this.usersService.findByEmail(username);

    // console.log('=========> ' + user.email);
    if (!user || !user.email) {
      throw new Error('Email not available');
    }

    console.log(pass, username);

    console.log("-------Password------" +pass +" , " + user.password);
    if (user.password !== pass) {
      throw new Error('Password not correct');
        }
    const payload = { ...user };
    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
