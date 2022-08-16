import { Chat } from '@game/models/chat.model';

export interface CreateChatParams {
  roomId: string;
}

export interface ChatRepository {
  create(params: CreateChatParams): Chat;
  findById(chatId: string): Chat;
  findByRoomId(roomId: string): Chat;
  update(chatId: string, chat: Partial<Chat>): Chat;
}
