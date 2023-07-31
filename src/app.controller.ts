import { Controller, Get, Query, Render, Req, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { data: 'Hello' };
  }

  @Sse('sse')
  sse(@Query() query: any) {
    console.log(query);
    return this.appService.subscribe();
    // return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }

  @Get('emit')
  async emit() {
    await this.appService.emit({ emitting: new Date().toISOString() });
    return { ok: true };
  }
}
