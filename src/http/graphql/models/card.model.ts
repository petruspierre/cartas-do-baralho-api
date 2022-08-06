import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CardType } from '@prisma/client';

import { Deck } from './deck.model';

@ObjectType()
export class Card {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field({ defaultValue: CardType.JOKE })
  type: CardType;

  @Field(() => Deck)
  deck: Deck;

  deckId: string;
}
