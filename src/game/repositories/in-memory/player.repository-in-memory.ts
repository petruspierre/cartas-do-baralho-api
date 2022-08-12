import { Player } from '@game/models/player.model';
import { Injectable } from '@nestjs/common';
import { generateName } from '@shared/helpers/generateName';
import { v4 as uuid } from 'uuid';

import {
  CreatePlayerParams,
  PlayerRepository,
} from '../interfaces/player.repository-interface';

@Injectable()
export class PlayerRepositoryInMemory implements PlayerRepository {
  players: Player[] = [];

  findById(id: string): Player {
    return this.players.find((player) => player.id === id);
  }

  findByClientId(id: string): Player {
    return this.players.find((player) => player.clientId === id);
  }

  update(id: string, params: Partial<CreatePlayerParams>): Player {
    const player = this.findById(id);

    if (!player) {
      throw new Error('Player not found');
    }

    Object.assign(player, params);

    return player;
  }

  create({ name = '', clientId }: CreatePlayerParams): Player {
    const player = new Player();

    Object.assign(player, {
      id: uuid(),
      clientId,
      name: name.length === 0 ? generateName() : name,
    } as Player);

    this.players.push(player);

    return player;
  }

  delete(id: string) {
    this.players = this.players.filter((player) => player.id !== id);
  }
}
