import { Injectable } from '@nestjs/common';
import { MessageQueueService } from 'src/message-queue/message-queue.service';
import { NoFileError, InvalidFormatError } from "./uploader.errors";
import { randomUUID } from 'node:crypto';
import * as fs from 'fs/promises';
import * as path from 'path';


@Injectable()
export class UploaderService {
    constructor(private readonly messageQueueService: MessageQueueService) {}

    async uploadLogFile(file?: Express.Multer.File): Promise<{ status: string; code: number }> {
        if (!file) {
          throw new NoFileError();
        }
    
        if (!file.originalname.endsWith(".txt")) {
          throw new InvalidFormatError();
        }
    
        const content = file.buffer.toString("utf-8");

        const jobId = randomUUID();
        const filePath = path.join('/tmp', `${jobId}.txt`);
        await fs.writeFile(filePath, content);
        await this.messageQueueService.publishLogForParsing({ jobId, filePath, originalName: file.originalname });
    
        return { status: "queued", code: 202 };
      }
}