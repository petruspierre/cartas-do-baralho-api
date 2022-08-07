import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { RoomService } from '@game/services/room.service';

import { events } from './events';
import { Inject, UsePipes } from '@nestjs/common';
import { ParseJsonPipe } from './pipes/parse-json.pipe';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

interface CreateRoomBody {
  hostName: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(RoomService)
    private roomService: RoomService,
  ) {}

  @SubscribeMessage(events.CREATE_ROOM)
  @UsePipes(new ParseJsonPipe())
  createRoom(
    @MessageBody() data: CreateRoomBody,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomService.create(data.hostName);

    client.join(room.id);

    this.server.to(room.id).emit('room-created', room);
  }
}
