import { Chat } from '@game/models/chat.model';
import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import {
  ChatRepository,
  CreateChatParams,
} from '../interfaces/chat.repository-interface';

@Injectable()
export class ChatRepositoryInMemory implements ChatRepository {
  chats: Chat[] = [];

  findById(id: string): Chat {
    const chat = this.chats.find((c) => c.id === id);

    return chat;
  }

  findByRoomId(id: string): Chat {
    const chat = this.chats.find((c) => c.roomId === id);

    return chat;
  }

  create(params: CreateChatParams): Chat {
    const chat = new Chat();

    Object.assign(chat, {
      id: uuid(),
      roomId: params.roomId,
      messages: [],
    } as Chat);

    this.chats.push(chat);

    return chat;
  }

  update(chatId: string, chat: Partial<Chat>): Chat {
    const index = this.chats.findIndex((c) => c.id === chatId);

    this.chats[index] = {
      ...this.chats[index],
      ...chat,
    };

    return this.chats[index];
  }
}
