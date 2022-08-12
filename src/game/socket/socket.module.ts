import { Module } from '@nestjs/common';

import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';
import { PlayerRepositoryInMemory } from '@game/repositories/in-memory/player.repository-in-memory';
import { RoomService } from '@game/services/room.service';

import { GameGateway } from './game.gateway';
import { PlayerService } from '@game/services/player.service';

@Module({
  imports: [],
  providers: [
    RoomRepositoryInMemory,
    PlayerRepositoryInMemory,

    RoomService,
    PlayerService,

    GameGateway,
  ],
})
export class SocketModule {}
