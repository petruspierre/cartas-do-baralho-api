import { Injectable } from '@nestjs/common';

import { Room } from '@game/models/room.model';
import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';
import { Player } from '@game/models/player.model';

@Injectable()
export class RoomService {
  constructor(private roomRepository: RoomRepositoryInMemory) {}

  findByCode(code: string): Room {
    return this.roomRepository.findByCode(code);
  }

  create(host: Player): Room {
    return this.roomRepository.create({ host });
  }

  update(code: string, room: Partial<Room>): Room {
    return this.roomRepository.update(code, room);
  }

  detelePlayer(code: string, playerId: string) {
    const room = this.roomRepository.findByCode(code);

    const updatedRoom = this.roomRepository.update(code, {
      players: room.players.filter((player) => player.id !== playerId),
      hostId: room.players.length > 1 ? room.players[0].id : null,
    });

    return updatedRoom;
  }
}
