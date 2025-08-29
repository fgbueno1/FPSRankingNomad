import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchStatsService } from './match-stats.service';
import { Match, MatchSchema } from 'src/mongo-connector/match-details.schema';
import { UploaderModule } from 'src/uploader/uploader.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    forwardRef(() => UploaderModule),
  ],
  providers: [MatchStatsService],
  exports: [MatchStatsService],
})
export class MatchStatsModule {}
