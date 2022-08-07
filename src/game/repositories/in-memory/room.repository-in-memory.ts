import { v4 as uuid } from 'uuid';
import { Room } from '@game/models/Room';

import {
  CreateRoomParams,
  RoomRepository,
} from '../interfaces/room.repository-interface';

export class RoomRepositoryInMemory implements RoomRepository {
  rooms: Room[] = [];

  create({ host }: CreateRoomParams): Room {
    const room = new Room();

    const roomCode = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5);

    Object.assign(room, {
      id: uuid(),
      hostId: host.id,
      code: roomCode,
      players: [
        {
          id: host.id,
          name: host.name,
        },
      ],
    } as Room);

    this.rooms.push(room);

    return room;
  }
}
