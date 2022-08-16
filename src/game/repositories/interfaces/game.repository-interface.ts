import { Game } from '@game/models/game.model';

export interface CreateGameParams {
  judgeId: string;
  roomId: string;
}

export interface GameRepository {
  create(params: CreateGameParams): Game;
}
