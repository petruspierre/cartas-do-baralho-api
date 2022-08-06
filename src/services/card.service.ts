import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma/prisma.service';
import { CardType } from '@shared/types/CardType';

interface CreateCardParams {
  text: string;
  deckId: string;
  type?: CardType;
}

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async listAllCardsByDeck(deckId: string) {
    return this.prisma.card.findMany({
      where: {
        deckId,
      },
    });
  }

  async createCard({ text, deckId, type }: CreateCardParams) {
    return this.prisma.card.create({
      data: {
        text,
        deckId,
        type,
      },
    });
  }
}
