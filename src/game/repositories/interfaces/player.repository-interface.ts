import { Player } from '@game/models/player.model';

export interface CreatePlayerParams {
  name?: string;
  clientId: string;
}

export interface PlayerRepository {
  create(params: CreatePlayerParams): Player;
  findByClientId(id: string): Player;
  findById(id: string): Player;
  update(id: string, params: Partial<CreatePlayerParams>): Player;
  delete(id: string): void;
}
