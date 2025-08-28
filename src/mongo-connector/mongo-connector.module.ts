import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectorService } from './mongo-connector.service';
import { Match, MatchSchema } from './match-details.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
  ],
  providers: [MongoConnectorService],
  exports: [MongoConnectorService],
})
export class MongoConnectorModule {}