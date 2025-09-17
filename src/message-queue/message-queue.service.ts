import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { MatchLog } from 'src/uploader/fps-logs.dto';
import * as amqp from 'amqplib';

@Injectable()
export class MessageQueueService implements OnModuleDestroy {
  private channel: amqp.Channel;
  private readonly queueName = 'match-processing';

  constructor(
    @Inject('RABBITMQ_CONNECTION') private connection: amqp.Connection,
  ) {
    this.initializeChannel();
  }

  private async initializeChannel() {
    this.channel = await (this.connection as any).createChannel();
    await this.channel.assertQueue(this.queueName, {
      durable: true, // Queue survives broker restarts
    });
  }

  async publishMatchForProcessing(matches: MatchLog[]): Promise<void> {
    if (!this.channel) {
      await this.initializeChannel();
    }

    const message = JSON.stringify(matches);
    
    const sent = this.channel.sendToQueue(
      this.queueName,
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
