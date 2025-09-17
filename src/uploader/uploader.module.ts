import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { MessageQueueModule } from 'src/message-queue/message-queue.module';

@Module({
  imports: [MessageQueueModule],
  controllers: [UploaderController],
  providers: [UploaderService],
  exports: [UploaderService],
})
export class UploaderModule {}
