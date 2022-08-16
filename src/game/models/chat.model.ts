import { Message } from './message.model';

export class Chat {
  id: string;
  roomId: string;
  messages: Message[];
}
