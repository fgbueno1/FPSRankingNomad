import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageQueueService } from './message-queue.service';
import { MatchProcessorService } from './match-processor.service';
import { MatchStatsModule } from 'src/match-stats/match-stats.module';

@Module({
  imports: [ConfigModule, MatchStatsModule],
  providers: [
    {
      provide: 'RABBITMQ_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const amqp = require('amqplib');
        const connection = await amqp.connect(configService.get<string>('RABBITMQ_URL') || 'amqp://localhost');
        return connection;
      },
      inject: [ConfigService],
    },
    MessageQueueService,
    MatchProcessorService,
  ],
  exports: [MessageQueueService, MatchProcessorService],
})
export class MessageQueueModule {}
