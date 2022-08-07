import { Player } from '@game/models/Player';

export interface CreatePlayerParams {
  name?: string;
}

export interface PlayerRepository {
  create(params: CreatePlayerParams): Player;
}
