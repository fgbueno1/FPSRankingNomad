import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalRanking, GlobalRankingSchema } from 'src/mongo-connector/global-ranking.schema';
import { GlobalRankingService } from './global-ranking.service';
import { GlobalRankingController } from './global-ranking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GlobalRanking.name, schema: GlobalRankingSchema }]),
  ],
  providers: [GlobalRankingService],
  controllers: [GlobalRankingController],
  exports: [GlobalRankingService],
})
export class GlobalRankingModule {}
