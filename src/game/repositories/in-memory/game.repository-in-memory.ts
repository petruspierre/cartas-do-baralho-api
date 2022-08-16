import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Game } from '@game/models/game.model';

import {
  CreateGameParams,
  GameRepository,
} from '../interfaces/game.repository-interface';

@Injectable()
export class GameRepositoryInMemory implements GameRepository {
  games: Game[] = [];

  create(params: CreateGameParams): Game {
    const game = new Game();

    Object.assign(game, {
      id: uuid(),
      judgeId: params.judgeId,
      roomId: params.roomId,
      round: 1,
      table: [],
    } as Game);

    return game;
  }
}
