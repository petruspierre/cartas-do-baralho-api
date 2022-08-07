import { Module } from '@nestjs/common';

import { PlayerRepositoryInMemory } from '@game/repositories/in-memory/player.repository-in-memory';
import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';
import { RoomService } from '@game/services/room.service';

import { GameGateway } from './game.gateway';

@Module({
  imports: [],
  providers: [
    RoomRepositoryInMemory,
    PlayerRepositoryInMemory,

    RoomService,

    GameGateway,
  ],
})
export class SocketModule {}
