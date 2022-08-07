export class Room {
  id: string;

  code: string;

  hostId: string; // Player

  players: {
    id: string;
    name: string;
  }[];
}
