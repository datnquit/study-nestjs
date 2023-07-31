import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Req } from '@nestjs/common';
import { PostService } from './post/services/post.service';

@WebSocketGateway()
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly postService: PostService) {}

  @SubscribeMessage('MESSAGE')
  async handleJoinAdminSync(@ConnectedSocket() socket: Socket) {
    const posts = await this.postService.getAllPosts('hihii', 1, 20);
    console.log('emit message');
    this.server.to('aaaa').emit('haha');
    return posts;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit(socket: Socket): any {
    console.log('after init :', socket.id);
  }

  async handleConnection(socket: Socket): Promise<any> {
    const authHeaders = socket.handshake.headers.authorization;
    socket.join('aaaa');
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      console.log('connection: ', socket.id);
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    if (socket.data && typeof socket.data.customer != 'undefined') {
      console.log('disconnect: ', socket.id);
    } else {
      console.log('disconnect-data');
    }
  }
}
