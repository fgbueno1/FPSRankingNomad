import { Test, TestingModule } from '@nestjs/testing';
import { UploaderService } from './uploader.service';
import { MessageQueueService } from 'src/message-queue/message-queue.service';
import { NoFileError, InvalidFormatError } from './uploader.errors';

describe('UploaderService', () => {
  let service: UploaderService;
  let messageQueueService: MessageQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploaderService,
        {
          provide: MessageQueueService,
          useValue: {
            publishLogForParsing: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UploaderService>(UploaderService);
    messageQueueService = module.get<MessageQueueService>(MessageQueueService);
  });

  describe('parseLogFile', () => {
    it('should throw NoFileError if no file is provided', async () => {
      await expect(service.uploadLogFile(undefined)).rejects.toThrow(NoFileError);
    });

    it('should throw InvalidFormatError if file extension is not .txt', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'invalid.log',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from(''),
        size: 0,
        destination: '',
        filename: '',
        path: '',
        stream: {} as any,
      };

      await expect(service.uploadLogFile(mockFile)).rejects.toThrow(InvalidFormatError);
    });

    it('should parse valid logs and publish matches to the queue', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from(`
          25/06/2025 15:34:22 - New match 12345 has started
          25/06/2025 15:35:00 - <RED> Roman killed <BLUE> Nick using M16 assisted by <RED> Logan
          25/06/2025 15:36:00 - <WORLD> killed <BLUE> Nick by DROWN
          25/06/2025 15:37:00 - Match 12345 has ended
        `),
        size: 0,
        destination: '',
        filename: '',
        path: '',
        stream: {} as any,
      };

      const result = await service.uploadLogFile(mockFile);

      expect(result).toEqual({ status: 'queued', code: 202 });
      expect(messageQueueService.publishLogForParsing).toHaveBeenCalledTimes(1);
    });
  });
});
