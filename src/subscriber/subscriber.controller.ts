import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private readonly subscriberService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getSubscribers() {
    return this.subscriberService.send(
      {
        cmd: 'get-all-subscriber',
      },
      {},
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberTCP(@Req() req: any) {
    return this.subscriberService.send(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
  }

  @Post('event')
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberEvent(@Req() req: any) {
    this.subscriberService.emit(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
    return true;
  }
}
