import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from './services/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRETKEY_REFRESH,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, { email }) {
    const refreshToken = request.headers['authorization'].split(' ')[1];

    return await this.userService.getUserRefreshToken(refreshToken, email);
  }
}
