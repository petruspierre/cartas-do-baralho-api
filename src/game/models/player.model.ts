import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Player {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  clientId: string;

  @Field({ nullable: true })
  roomId?: string;
}
