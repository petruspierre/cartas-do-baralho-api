import { Query, Resolver } from '@nestjs/graphql';
import { DecksService } from '@services/deck.service';

import { Deck } from '../models/deck.model';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(private decksService: DecksService) {}

  @Query(() => [Deck])
  decks() {
    return this.decksService.listAllDecks();
  }
}
