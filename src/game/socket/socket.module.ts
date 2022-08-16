import { Module } from '@nestjs/common';

import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';
import { PlayerRepositoryInMemory } from '@game/repositories/in-memory/player.repository-in-memory';
import { RoomService } from '@game/services/room.service';

import { GameGateway } from './game.gateway';
import { PlayerService } from '@game/services/player.service';
import { GameRepositoryInMemory } from '@game/repositories/in-memory/game.repository-in-memory';
import { GameService } from '@game/services/game.service';

@Module({
  imports: [],
  providers: [
    RoomRepositoryInMemory,
    PlayerRepositoryInMemory,
    GameRepositoryInMemory,

    RoomService,
    PlayerService,
    GameService,

    GameGateway,
  ],
})
export class SocketModule {}
