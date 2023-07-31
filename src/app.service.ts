import { Injectable } from '@nestjs/common';
import { fromEvent } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(private readonly emitter: EventEmitter2) {}
  getHello(): string {
    return 'Hello World!';
  }

  subscribe() {
    return fromEvent(this.emitter, 'eventName');
  }

  async emit(data) {
    this.emitter.emit('eventName', { data });
  }
}
