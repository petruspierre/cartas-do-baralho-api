import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CardsService } from '@services/card.service';
import { DecksService } from '@services/deck.service';

import { Deck } from '../models/deck.model';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(
    private decksService: DecksService,
    private cardsService: CardsService,
  ) {}

  @Query(() => [Deck])
  decks() {
    return this.decksService.listAllDecks();
  }

  @ResolveField()
  cards(@Parent() deck: Deck) {
    return this.cardsService.listAllCardsByDeck(deck.id);
  }
}
