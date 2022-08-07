import { faker } from '@faker-js/faker/locale/pt_BR';
import { Player } from '@game/models/Player';
import { v4 as uuid } from 'uuid';

import {
  CreatePlayerParams,
  PlayerRepository,
} from '../interfaces/player.repository-interface';

export class PlayerRepositoryInMemory implements PlayerRepository {
  players: Player[] = [];

  create({ name }: CreatePlayerParams): Player {
    const player = new Player();

    Object.assign(player, {
      id: uuid(),
      name: name ?? `${faker.word.adjective()}-${faker.animal.type()}`,
    } as Player);

    this.players.push(player);

    return player;
  }
}
