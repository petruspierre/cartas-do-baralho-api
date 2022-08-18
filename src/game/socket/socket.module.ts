import { Module } from '@nestjs/common';

import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';
import { PlayerRepositoryInMemory } from '@game/repositories/in-memory/player.repository-in-memory';
import { RoomService } from '@game/services/room.service';

import { GameGateway } from './game.gateway';
import { PlayerService } from '@game/services/player.service';
import { GameRepositoryInMemory } from '@game/repositories/in-memory/game.repository-in-memory';
import { GameService } from '@game/services/game.service';
import { ChatService } from '@game/services/chat.service';
import { ChatRepositoryInMemory } from '@game/repositories/in-memory/chat.repository-in-memory';

@Module({
  imports: [],
  providers: [
    RoomRepositoryInMemory,
    PlayerRepositoryInMemory,
    GameRepositoryInMemory,
    ChatRepositoryInMemory,

    RoomService,
    PlayerService,
    GameService,
    ChatService,

    GameGateway,
  ],
})
export class SocketModule {}
