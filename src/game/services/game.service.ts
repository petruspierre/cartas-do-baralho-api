import { Injectable, NotFoundException } from '@nestjs/common';

import { GameRepositoryInMemory } from '@game/repositories/in-memory/game.repository-in-memory';
import { RoomRepositoryInMemory } from '@game/repositories/in-memory/room.repository-in-memory';

@Injectable()
export class GameService {
  constructor(
    private gameRepository: GameRepositoryInMemory,
    private roomRepository: RoomRepositoryInMemory,
  ) {}

  create(roomId: string) {
    const room = this.roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const game = this.gameRepository.create({
      judgeId: room.players[0].id,
      roomId: room.id,
    });

    this.roomRepository.update(room.id, {
      gameId: game.id,
    });

    return game;
  }

  findByRoomId(roomId: string) {
    return this.gameRepository.findByRoomId(roomId);
  }
}
