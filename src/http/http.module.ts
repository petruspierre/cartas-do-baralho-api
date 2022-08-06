import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'node:path';

import { DatabaseModule } from '@database/database.module';
import { DeckResolver } from './graphql/resolvers/deck.resolver';
import { DecksService } from '@services/deck.service';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [DeckResolver, DecksService],
})
export class HttpModule {}
