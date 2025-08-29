import { Module, forwardRef } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { MatchStatsModule } from 'src/match-stats/match-stats.module';

@Module({
  imports: [forwardRef(() => MatchStatsModule)],
  controllers: [UploaderController],
  providers: [UploaderService],
  exports: [UploaderService],
})
export class UploaderModule {}
