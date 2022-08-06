import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma/prisma.service';

interface CreateDeckParams {
  title: string;
  description?: string;
}

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async listAllDecks() {
    return this.prisma.deck.findMany();
  }

  async createCard({ title, description }: CreateDeckParams) {
    return this.prisma.deck.create({
      data: {
        title,
        description,
      },
    });
  }
}
