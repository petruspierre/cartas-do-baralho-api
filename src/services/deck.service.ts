import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma/prisma.service';

interface CreateDeckParams {
  title: string;
  description?: string;
}

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  async listAllDecks() {
    return this.prisma.deck.findMany();
  }

  async getDeckById(id: string) {
    return this.prisma.deck.findFirst({
      where: {
        id,
      },
    });
  }

  async createDeck({ title, description }: CreateDeckParams) {
    return this.prisma.deck.create({
      data: {
        title,
        description,
      },
    });
  }
}
