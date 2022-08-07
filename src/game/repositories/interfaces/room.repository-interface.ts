import { Player } from '@game/models/Player';
import { Room } from '@game/models/Room';

export interface CreateRoomParams {
  host: Player;
}

export interface RoomRepository {
  create(params: CreateRoomParams): Room;
}
