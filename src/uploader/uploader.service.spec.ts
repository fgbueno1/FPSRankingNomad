import { Test, TestingModule } from '@nestjs/testing';
import { UploaderService } from './uploader.service';
import { MatchLog } from './fps-logs.dto'; 

describe('UploaderService', () => {
  let service: UploaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploaderService],
    }).compile();

    service = module.get<UploaderService>(UploaderService);
  });

  describe('parseLogFile', () => {
    it('should correctly parse multiple matches from a single log file', () => {
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
        stream: { 
          on: () => {}, 
          pipe: () => {}, 
          resume: () => {}, 
          pause: () => {}, 
          emit: () => {}, 
          readable: true 
        } as any,
      };

      const result: MatchLog[] = service.parseLogFile(mockFile);

      expect(result).toHaveLength(2);

      expect(result[0].matchId).toBe('11348965');
      expect(result[0].events).toHaveLength(5);
      const event1 = result[0].events[1];
      expect({
        ...event1,
        timestamp: event1.timestamp.toISOString(),
      }).toEqual({
        type: 'KILL',
        timestamp: '2025-06-25T18:36:04.000Z',
        killerTeam: 'RED',
        killerName: 'Roman',
        victimTeam: 'BLUE',
        victimName: 'Nick',
        weapon: 'M16',
        assistTeam: 'RED',
        assistName: 'Logan'
      });

      expect(result[1].matchId).toBe('11348967');
      expect(result[1].events).toHaveLength(5);
      const event2 = result[1].events[3];
      expect({
        ...event2,
        timestamp: event2.timestamp.toISOString(),
      }).toEqual({
        type: 'KILL',
        timestamp: '2025-06-25T18:37:44.000Z',
        killerTeam: 'RED',
        killerName: 'Roman',
        victimTeam: 'RED',
        victimName: 'Sants',
        weapon: 'M16',
        assistTeam: undefined,
        assistName: undefined
      });
    });
  });
});
