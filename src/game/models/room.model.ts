import { Player } from './player.model';

export class Room {
  id: string;

  code: string;

  hostId: string; // Player

  players: Player[];

  gameId?: string;
}
