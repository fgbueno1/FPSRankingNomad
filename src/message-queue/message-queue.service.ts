import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { MatchLog } from 'src/parser/fps-logs.dto';
import * as amqp from 'amqplib';

@Injectable()
export class MessageQueueService implements OnModuleDestroy {
  private channel: amqp.Channel;
  private readonly queues = {
    logParsing: 'log-parsing',
    matchProcessing: 'match-processing',
  };

  constructor(
    @Inject('RABBITMQ_CONNECTION') private connection: amqp.Connection,
  ) {
    this.initializeChannel();
  }

  private async initializeChannel() {
    this.channel = await (this.connection as any).createChannel();
    await this.channel.assertQueue(this.queues.logParsing, { durable: true });
    await this.channel.assertQueue(this.queues.matchProcessing, { durable: true });
  }

  async publishLogForParsing(payload: { jobId: string; filePath: string; originalName: string }): Promise<void> {
    if (!this.channel) {
      await this.initializeChannel();
    }

    const message = JSON.stringify(payload);
    const sent = this.channel.sendToQueue(
      this.queues.logParsing,
      Buffer.from(message),
      { persistent: true },
    );

    if (!sent) {
      throw new Error('Failed to send message to log-parsing queue');
    }

    console.log(`Published log file job ${payload.jobId} to log-parsing queue`);
  }

  // publishMatchForProcessing publishes the matches to the queue
  async publishMatchForProcessing(matches: MatchLog[]): Promise<void> {
    if (!this.channel) {
      await this.initializeChannel();
    }

    const message = JSON.stringify(matches);
    
    const sent = this.channel.sendToQueue(
      this.queues.matchProcessing,
      Buffer.from(message),
      {
        persistent: true, // Message survives broker restarts
      }
    );

    if (!sent) {
      throw new Error('Failed to send message to queue');
    }

    console.log(`Published ${matches.length} matches for processing`);
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await (this.connection as any).close();
    }
  }
}
