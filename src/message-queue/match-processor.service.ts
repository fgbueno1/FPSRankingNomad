import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MatchLog } from 'src/uploader/fps-logs.dto';
import { MatchStatsService } from 'src/match-stats/match-stats.service';
import * as amqp from 'amqplib';

@Injectable()
export class MatchProcessorService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;
  private readonly queueName = 'match-processing';

  constructor(
    @Inject('RABBITMQ_CONNECTION') private connection: any,
    private readonly matchStatsService: MatchStatsService,
  ) {}

  async onModuleInit() {
    await this.initializeChannel();
    await this.startConsuming();
  }

  private async initializeChannel() {
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, {
      durable: true,
    });
    
    // Set prefetch to 1 to process one message at a time
    await this.channel.prefetch(1);
  }

  private async startConsuming() {
    console.log('Starting to consume match processing messages...');
    
    await this.channel.consume(
      this.queueName,
      async (msg) => {
        if (msg) {
          try {
            const matches: MatchLog[] = JSON.parse(msg.content.toString());
            console.log(`Processing ${matches.length} matches...`);
            
            await this.matchStatsService.calculateAndSave(matches);
            
            this.channel.ack(msg);
            console.log(`Successfully processed ${matches.length} matches`);
          } catch (error) {
            console.error('Error processing matches:', error);
            
            this.channel.nack(msg, false, false);
          }
        }
      },
      {
        noAck: false,
      }
    );
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
  }
}
