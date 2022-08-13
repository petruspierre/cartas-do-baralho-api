import { Injectable } from '@nestjs/common';

import { PlayerRepositoryInMemory } from '@game/repositories/in-memory/player.repository-in-memory';
import { Player } from '@game/models/player.model';

@Injectable()
export class PlayerService {
  constructor(private playerRepository: PlayerRepositoryInMemory) {}

  findByClientId(id: string): Player {
    return this.playerRepository.findByClientId(id);
  }

  create(clientId: string, hostName?: string): Player {
    return this.playerRepository.create({ name: hostName ?? '', clientId });
  }

  update(id: string, player: Partial<Player>): Player {
    if (!id) {
      throw new Error('Player id is required');
    }

    return this.playerRepository.update(id, player);
  }

  delete(id: string) {
    this.playerRepository.delete(id);
  }
}
