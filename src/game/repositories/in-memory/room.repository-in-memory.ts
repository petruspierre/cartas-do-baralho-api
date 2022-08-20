import { v4 as uuid } from 'uuid';
import { Room } from '@game/models/room.model';
import { Injectable } from '@nestjs/common';

import { RoomRepository } from '../interfaces/room.repository-interface';

@Injectable()
export class RoomRepositoryInMemory implements RoomRepository {
  rooms: Room[] = [];

  findByCode(code: string): Room {
    return this.rooms.find((r) => r.code === code);
  }

  findById(id: string): Room {
    return this.rooms.find((r) => r.id === id);
  }

  create(): Room {
    const room = new Room();

    const roomCode = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5);

    Object.assign(room, {
      id: uuid(),
      hostId: '',
      code: roomCode,
      players: [],
    } as Room);

    this.rooms.push(room);

    return room;
  }

  update(code: string, room: Partial<Room>): Room {
    const index = this.rooms.findIndex((r) => r.code === code);

    this.rooms[index] = {
      ...this.rooms[index],
      ...room,
    };

    return this.rooms[index];
  }

  delete(code: string): void {
    this.rooms = this.rooms.filter((r) => r.code !== code);
  }
}
