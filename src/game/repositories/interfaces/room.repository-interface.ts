import { Player } from '@game/models/player.model';
import { Room } from '@game/models/room.model';

export interface CreateRoomParams {
  host: Player;
}

export interface RoomRepository {
  create(params: CreateRoomParams): Room;
  update(code: string, room: Partial<Room>): Room;
  findByCode(code: string): Room;
  findById(id: string): Room;
}
