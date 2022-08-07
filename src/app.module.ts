import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@http/http.module';
import { Module } from '@nestjs/common';

import { GameModule } from '@game/game.module';

@Module({
  imports: [DatabaseModule, HttpModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
