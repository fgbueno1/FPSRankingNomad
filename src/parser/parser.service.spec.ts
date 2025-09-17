import { Test, TestingModule } from '@nestjs/testing';
import { ParserService } from './parser.service';
import * as fs from 'fs';
import { InvalidLogError } from './parser.errors';

jest.mock('fs');

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParserService],
    }).compile();

    service = module.get<ParserService>(ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse a log file with MATCH_START and MATCH_END', () => {
    const fakeLog = `
      23/08/2025 10:15:00 - New match 123 has started
      23/08/2025 10:30:00 - Match 123 has ended
    `;
    (fs.readFileSync as jest.Mock).mockReturnValue(fakeLog);

    const result = service.parseLogFile('fake.log');

    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('123');
    expect(result[0].start).toBeInstanceOf(Date);
    expect(result[0].end).toBeInstanceOf(Date);
    expect(result[0].events).toHaveLength(2);
  });

  it('should parse a log file with a kill event', () => {
    const fakeLog = `
      23/08/2025 10:20:00 - <Red> Alice killed <Blue> Bob using Rifle
    `;
    (fs.readFileSync as jest.Mock).mockReturnValue(fakeLog);

    const result = service.parseLogFile('fake.log');

    expect(result).toHaveLength(0);
  });

  it('should throw InvalidLogError for invalid lines', () => {
    const fakeLog = `
      23/08/2025 10:25:00 - This is not valid
    `;
    (fs.readFileSync as jest.Mock).mockReturnValue(fakeLog);

    expect(() => service.parseLogFile('fake.log')).toThrow(InvalidLogError);
  });
});
