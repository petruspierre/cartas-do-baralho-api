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
import { GameService } from '@game/services/game.service';

interface JoinRoomBody {
  roomCode: string;
  playerName?: string;
}

interface KickPlayerBody {
  playerId: string;
}

@WebSocketGateway({
  cors: true,
})
export class GameGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private playerService: PlayerService,
    private chatService: ChatService,
    private gameService: GameService,
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

    // if(!updatedRoom) {
    //   this.gameService.delete()
    // }

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
  createRoom(@ConnectedSocket() client: Socket) {
    const room = this.roomService.create();
    this.chatService.create(room.id);

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
    }

    let room = this.roomService.findByCode(data.roomCode);

    if (!room) {
      room = this.roomService.create();
    }

    this.logger.log(`Room ${data.roomCode} found. Joining...`);

    room = this.roomService.update(room.code, {
      code: data.roomCode,
      hostId: room.hostId === '' ? player.id : room.hostId,
      players: [...room.players, player],
    });

    let chat = this.chatService.findByRoomId(room.id);
    if (!chat) {
      this.logger.log(`Chat not found. Creating...`);
      chat = this.chatService.create(room.id);
    }

    console.log(chat);

    const updatedPlayer = this.playerService.update(player.id, {
      roomId: room.code,
    });

    client.join(room.code);

    const game = this.gameService.findByRoomId(room.id);

    client.emit(events.ROOM_JOINED, {
      player: updatedPlayer,
      room: room,
      game,
      chat,
    });
    client.to(room.code).emit('player-joined', { room });
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
      authorName: author.name,
    });

    const newMessage = updatedChat.messages[updatedChat.messages.length - 1];

    this.server.to(author.roomId).emit(events.CHAT_NEW_MESSAGE, {
      message: newMessage,
    });
  }

  @SubscribeMessage(events.START_GAME)
  @UsePipes(new ParseJsonPipe())
  startGame(@ConnectedSocket() client: Socket) {
    const player = this.playerService.findByClientId(client.id);

    if (!player || !player.roomId) {
      return;
    }

    this.logger.log('Starting game for room: ' + player.roomId);

    const room = this.roomService.findByCode(player.roomId);

    if (!room) {
      this.logger.log('Room not found for game');
      return;
    }

    if (room.hostId !== player.id) {
      this.logger.log('Player is not host');
      return;
    }

    if (room.players.length < 2) {
      this.logger.log('Not enough players');
      return;
    }

    if (room.gameId) {
      this.logger.log('Game already started');
      return;
    }

    const game = this.gameService.create(room.id);

    this.server.to(room.code).emit(events.GAME_STARTED, {
      game,
    });
  }
}
