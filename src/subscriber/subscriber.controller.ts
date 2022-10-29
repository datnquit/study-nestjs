import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import SubscriberInterface from './subscriber.interface';

@Controller('subscriber')
export class SubscriberController implements OnModuleInit {
  private gRpcService: SubscriberInterface;
  constructor(
    // @Inject('SUBSCRIBER_SERVICE')
    // private readonly subscriberService: ClientProxy,
    @Inject('SUBSCRIBER_SERVICE')
    private client: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.gRpcService =
      this.client.getService<SubscriberInterface>('SubscriberService');
  }

  @Get()
  async getSubscribers() {
    return this.gRpcService.getAllSubscribers({});
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any) {
    return this.gRpcService.addSubscriber({
      email: req.user.email,
      name: req.user.name,
    });
  }

  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // async getSubscribers() {
  //   return this.subscriberService.send(
  //     {
  //       cmd: 'get-all-subscriber',
  //     },
  //     {},
  //   );
  // }
  //
  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // async createSubscriberTCP(@Req() req: any) {
  //   return this.subscriberService.send(
  //     {
  //       cmd: 'add-subscriber',
  //     },
  //     req.user,
  //   );
  // }
  //
  // @Post('event')
  // @UseGuards(AuthGuard('jwt'))
  // async createSubscriberEvent(@Req() req: any) {
  //   this.subscriberService.emit(
  //     {
  //       cmd: 'add-subscriber',
  //     },
  //     req.user,
  //   );
  //   return true;
  // }
  //
  // @Post('rmq')
  // @UseGuards(AuthGuard('jwt'))
  // async createPost(@Req() req: any) {
  //   return this.subscriberService.send(
  //     {
  //       cmd: 'add-subscriber',
  //     },
  //     req.user,
  //   );
  // }
}
