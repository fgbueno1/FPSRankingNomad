import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ParserService } from 'src/parser/parser.service';
import * as amqp from 'amqplib';
import { MessageQueueService } from './message-queue.service';

@Injectable()
export class LogParserService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;
  private readonly queueName = 'log-parsing';

  constructor(
    @Inject('RABBITMQ_CONNECTION') private connection: any,
    private readonly parserService: ParserService,
    private readonly messageQueueService: MessageQueueService,
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
    console.log('Starting to consume log parsing messages...');
    
    await this.channel.consume(
      this.queueName,
      async (msg) => {
        if (msg) {
          try {
            const payload: { jobId: string; filePath: string; originalName: string } = JSON.parse(msg.content.toString());
            console.log(`Processing ${payload.originalName}...`);
            
            const matches = await this.parserService.parseLogFile(payload.filePath);
            
            await this.messageQueueService.publishMatchForProcessing(matches);
            
            this.channel.ack(msg);
            console.log(`Successfully processed ${payload.originalName}`);
          } catch (error) {
            console.error('Error processing log file:', error);
            
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
