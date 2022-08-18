import { Injectable, NotFoundException } from '@nestjs/common';

import { ChatRepositoryInMemory } from '@game/repositories/in-memory/chat.repository-in-memory';

import { v4 as uuid } from 'uuid';
import { Chat } from '@game/models/chat.model';

interface AddMessageParams {
  chat: Chat;
  message: string;
  authorId: string;
}

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepositoryInMemory) {}

  findAllMessages(roomId: string) {
    const chat = this.chatRepository.findByRoomId(roomId);

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat.messages;
  }

  findByRoomId(roomId: string) {
    const chat = this.chatRepository.findByRoomId(roomId);

    return chat;
  }

  create(roomId: string) {
    const chat = this.chatRepository.create({ roomId: roomId });

    return chat;
  }

  addMessage(params: AddMessageParams) {
    const updatedChat = this.chatRepository.update(params.chat.id, {
      messages: [
        ...params.chat.messages,
        {
          id: uuid(),
          authorId: params.authorId,
          text: params.message,
        },
      ],
    });

    return updatedChat;
  }
}
