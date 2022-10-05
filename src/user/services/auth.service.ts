import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);

    const token = await this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);
    const token = await this._createToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(email) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async getAccess2FA(user: User) {
    return await this._createToken(user, true);
  }

  private async _createToken(
    { email },
    isSecondFactorAuthenticated = false,
  ): Promise<any> {
    const accessToken = this.jwtService.sign({
      email,
      isSecondFactorAuthenticated,
    });
    const refreshToken = this.jwtService.sign(
      { email },
      {
        secret: process.env.SECRETKEY_REFRESH,
        expiresIn: process.env.EXPIRESIN_REFRESH,
      },
    );
    await this.userService.update(
      { email: email },
      { refreshToken: refreshToken },
    );
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
      refreshToken,
      expiresInRefresh: process.env.EXPIRESIN_REFRESH,
    };
  }

  async refresh(user: User) {
    const token = await this._createToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async logout(user: User) {
    await this.userService.update(
      { email: user.email },
      { refreshToken: null },
    );
    return true;
  }
}
