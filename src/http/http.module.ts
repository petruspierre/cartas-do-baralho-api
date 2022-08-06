import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'node:path';

import { DatabaseModule } from '@database/database.module';
import { DeckResolver } from './graphql/resolvers/deck.resolver';
import { DecksService } from '@services/deck.service';
import { CardsService } from '@services/card.service';
import { CardResolver } from './graphql/resolvers/card.resolver';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [DeckResolver, CardResolver, DecksService, CardsService],
})
export class HttpModule {}
