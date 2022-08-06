import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@http/http.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
