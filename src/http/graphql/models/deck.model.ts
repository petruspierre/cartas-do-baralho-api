import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Card } from './card.model';

@ObjectType()
export class Deck {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Card])
  cards: Card[];
}
