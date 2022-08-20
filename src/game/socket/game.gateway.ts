import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, NotFoundException, UsePipes } from '@nestjs/common';

import { RoomService } from '@game/services/room.service';
import { PlayerService } from '@game/services/player.service';

import { events } from './events';
import { ParseJsonPipe } from './pipes/parse-json.pipe';
import { Room } from '@game/models/room.model';
import { ChatService } from '@game/services/chat.service';

interface CreateRoomBody {
  hostName: string;
}

interface JoinRoomBody {
  roomCode: string;
  playerName?: string;
}

interface KickPlayerBody {
  playerId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private playerService: PlayerService,
    private chatService: ChatService,
  ) {}

  @SubscribeMessage(events.LEAVE_ROOM)
  handleDisconnect(client: Socket) {
    const player = this.playerService.findByClientId(client.id);

    if (!player || !player.roomId) {
      return;
    }

    const room = this.roomService.findByCode(player.roomId);

    if (!room) {
      return;
    }

    client.leave(room.code);
    this.playerService.delete(player.id);
    const updatedRoom = this.roomService.deletePlayer(room.code, player.id);

    this.server
      .to(room.code)
      .emit(events.PLAYER_LEFT, { player, room: updatedRoom });
  }

  @SubscribeMessage(events.KICK_PLAYER)
  @UsePipes(new ParseJsonPipe())
  handlePlayerKicked(
    @MessageBody() data: KickPlayerBody,
    @ConnectedSocket() client: Socket,
  ) {
    const player = this.playerService.findByClientId(client.id);

    if (!player || !player.roomId) {
      return;
    }

    const room = this.roomService.findByCode(player.roomId);

    if (!room) {
      return;
    }

    this.playerService.delete(data.playerId);
    const updatedRoom = this.roomService.deletePlayer(room.code, data.playerId);

    this.server.to(room.code).emit(events.PLAYER_KICKED, { room: updatedRoom });
  }

  @SubscribeMessage(events.CREATE_ROOM)
  @UsePipes(new ParseJsonPipe())
  createRoom(
    @MessageBody() data: CreateRoomBody,
    @ConnectedSocket() client: Socket,
  ) {
    let host = this.playerService.create(client.id, data.hostName);

    const room = this.roomService.create(host);

    host = this.playerService.update(host.id, {
      roomId: room.code,
    });

    client.join(room.code);

    this.server.to(room.code).emit(events.ROOM_CREATED, room);
  }

  @SubscribeMessage(events.JOIN_ROOM)
  @UsePipes(new ParseJsonPipe())
  joinRoom(
    @MessageBody() data: JoinRoomBody,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Joining room ${data.roomCode}`);

    let player = this.playerService.findByClientId(client.id);

    if (!player) {
      player = this.playerService.create(client.id, data.playerName ?? '');
    } else if ((player.roomId = data.roomCode)) {
      return;
    }

    let room = this.roomService.findByCode(data.roomCode);
    let updatedRoom: Room = null;

    if (!room) {
      this.logger.log(`Room ${data.roomCode} not found. Creating...`);

      room = this.roomService.create(player);

      updatedRoom = this.roomService.update(room.code, {
        code: data.roomCode,
      });
    } else {
      this.logger.log(`Room ${data.roomCode} found. Joining...`);

      updatedRoom = this.roomService.update(room.code, {
        code: data.roomCode,
        players: [...room.players, player],
      });
    }

    const updatedPlayer = this.playerService.update(player.id, {
      roomId: updatedRoom.code,
    });

    client.join(updatedRoom.code);

    client.emit(events.ROOM_JOINED, {
      player: updatedPlayer,
      room: updatedRoom,
    });
    client.to(updatedRoom.code).emit('player-joined', { room: updatedRoom });
  }

  @SubscribeMessage(events.CHAT_SEND_MESSAGE)
  @UsePipes(new ParseJsonPipe())
  sendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const author = this.playerService.findByClientId(client.id);

    if (!author) {
      throw new NotFoundException('Player not found');
    }

    let chat = this.chatService.findByRoomId(author.roomId);

    if (!chat) {
      chat = this.chatService.create(author.roomId);
    }

    const updatedChat = this.chatService.addMessage({
      authorId: author.id,
      chat: chat,
      message: data.message,
    });

    const newMessage = updatedChat.messages[updatedChat.messages.length - 1];

    this.server.to(author.roomId).emit(events.CHAT_NEW_MESSAGE, {
      author: author.name,
      id: newMessage.id,
      text: newMessage.text,
    });
  }
}
