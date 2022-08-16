import { Card } from '@http/graphql/models/card.model';

export class Game {
  id: string;

  judgeId: string; // Player

  roomId: string; // Room

  round: number;

  table: Card[];
}
