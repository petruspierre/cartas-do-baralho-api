import { Injectable, Logger } from '@nestjs/common';

import { Room } from '@game/models/room.model';
import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';
import { Player } from '@game/models/player.model';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(private roomRepository: RoomRepositoryInMemory) {}

  findById(id: string): Room {
    return this.roomRepository.findById(id);
  }

  findByCode(code: string): Room {
    return this.roomRepository.findByCode(code);
  }

  create(): Room {
    return this.roomRepository.create();
  }

  update(code: string, room: Partial<Room>): Room {
    return this.roomRepository.update(code, room);
  }

  deletePlayer(code: string, playerId: string) {
    const room = this.roomRepository.findByCode(code);

    const playerIsHost = playerId === room.hostId;
    const firstPlayerNotHost = room.players.find((p) => p.id !== playerId);

    const updatedRoom = this.roomRepository.update(code, {
      players: room.players.filter((player) => player.id !== playerId),
      hostId:
        playerIsHost && firstPlayerNotHost
          ? firstPlayerNotHost.id
          : room.hostId,
    });

    if (updatedRoom.players.length === 0) {
      this.logger.log('Destroying room ' + code);
      this.roomRepository.delete(code);

      return null;
    }

    return updatedRoom;
  }
}
