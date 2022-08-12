import { Module } from '@nestjs/common';

import { PlayerRepositoryInMemory } from './in-memory/player.repository-in-memory';
import { RoomRepositoryInMemory } from './in-memory/room.repository-in-memory';

@Module({
  providers: [RoomRepositoryInMemory, PlayerRepositoryInMemory],
})
export class GameDatabaseModule {}
