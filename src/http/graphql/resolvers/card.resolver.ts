import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CardsService } from '@services/card.service';
import { DecksService } from '@services/deck.service';

import { Card } from '../models/card.model';

@Resolver(() => Card)
export class CardResolver {
  constructor(
    private cardsService: CardsService,
    private decksService: DecksService,
  ) {}

  @Query(() => [Card])
  cards(@Args('deckId') deckId: string) {
    return this.cardsService.listAllCardsByDeck(deckId);
  }

  @ResolveField()
  deck(@Parent() card: Card) {
    return this.decksService.getDeckById(card.deckId);
  }
}
