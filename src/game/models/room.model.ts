import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Player } from './player.model';

@ObjectType()
export class Room {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  hostId: string; // Player

  @Field(() => [Player])
  players: Player[];
}
