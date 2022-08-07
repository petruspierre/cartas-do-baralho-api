import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { RoomService } from '@game/services/room.service';

import { events } from './events';
import { Inject, UsePipes } from '@nestjs/common';
import { ParseJsonPipe } from './pipes/parse-json.pipe';

interface CreateRoomBody {
  hostName: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  constructor(
    @Inject(RoomService)
    private roomService: RoomService,
  ) {}

  @SubscribeMessage(events.CREATE_ROOM)
  @UsePipes(new ParseJsonPipe())
  createRoom(@MessageBody() data: CreateRoomBody) {
    const room = this.roomService.create(data.hostName);

    console.log(room);
    return 'room created';
  }
}
