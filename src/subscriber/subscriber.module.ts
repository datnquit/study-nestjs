import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscriberController } from './subscriber.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SubscriberController],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SUBSCRIBER_SERVICE_HOST'),
            port: configService.get('SUBSCRIBER_SERVICE_PORT'),
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class SubscriberModule {}
