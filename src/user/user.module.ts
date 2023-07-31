import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { TwoFactorAuthenticationController } from './controllers/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthentication.service';
import { JwtTwoFactorStrategy } from './jwtTwoFactor.strategy';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRETKEY,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    TwoFactorAuthenticationController,
  ],
  providers: [
    UserRepository,
    UserService,
    JwtStrategy,
    AuthService,
    JwtRefreshTokenStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
    EmailConsumer,
  ],
})
export class UserModule {}
