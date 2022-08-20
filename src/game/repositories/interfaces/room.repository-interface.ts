import { Room } from '@game/models/room.model';

export interface RoomRepository {
  create(): Room;
  update(code: string, room: Partial<Room>): Room;
  findByCode(code: string): Room;
  findById(id: string): Room;
  delete(code: string): void;
}
