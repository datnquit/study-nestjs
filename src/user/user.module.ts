import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './controllers/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwoFactorAuthenticationController } from './controllers/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthentication.service';
import { JwtTwoFactorStrategy } from './jwtTwoFactor.strategy';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';

// @Global()
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
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
    UserService,
    AuthService,
    UserRepository,
    JwtStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
    EmailConsumer,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}
