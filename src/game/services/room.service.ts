import { Inject, Injectable } from '@nestjs/common';

import { Room } from '@game/models/Room';
import { PlayerRepositoryInMemory } from '@game/repositories/in-memory/player.repository-in-memory';
import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';

@Injectable()
export class RoomService {
  constructor(
    @Inject(RoomRepositoryInMemory)
    private roomRepository: RoomRepositoryInMemory,
    @Inject(PlayerRepositoryInMemory)
    private playerRepository: PlayerRepositoryInMemory,
  ) {}

  create(hostName?: string): Room {
    const host = this.playerRepository.create({ name: hostName });

    return this.roomRepository.create({ host });
  }
}
