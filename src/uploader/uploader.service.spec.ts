import { Test, TestingModule } from '@nestjs/testing';
import { UploaderService } from './uploader.service';
import { MatchLog } from './fps-logs.dto';
import { MatchStatsService } from 'src/match-stats/match-stats.service';

describe('UploaderService', () => {
  let service: UploaderService;
  let matchStatsService: MatchStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploaderService,
        {
          provide: MatchStatsService,
          useValue: {
            calculateAndSave: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<UploaderService>(UploaderService);
    matchStatsService = module.get<MatchStatsService>(MatchStatsService);
  });

  describe('parseLogFile', () => {
    it('should correctly parse multiple matches from a single log file', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.log',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from(`
          25/06/2025 15:34:22 - New match 11348965 has started 
          25/06/2025 15:36:04 - <RED> Roman killed <BLUE> Nick using M16 assisted by <RED> Logan
          25/06/2025 15:37:14 - <WORLD> killed <BLUE> Nick by DROWN 
          25/06/2025 15:37:44 - <RED> Roman killed <RED> Sants using M16
          25/06/2025 15:38:07 - Match 11348965 has ended

          25/06/2025 15:34:22 - New match 11348967 has started
          25/06/2025 15:36:04 - <RED> Roman killed <BLUE> Nick using M16 assisted by <RED> Logan
          25/06/2025 15:37:14 - <WORLD> killed <BLUE> Nick by DROWN 
          25/06/2025 15:37:44 - <RED> Roman killed <RED> Sants using M16
          25/06/2025 15:38:07 - Match 11348967 has ended
        `),
        size: 0,
        destination: '',
        filename: '',
        path: '',
        stream: {} as any,
      };

      const result: MatchLog[] = service.parseLogFile(mockFile);

      expect(result).toHaveLength(2);
      expect(matchStatsService.calculateAndSave).toHaveBeenCalledTimes(1);
    });
  });
});
