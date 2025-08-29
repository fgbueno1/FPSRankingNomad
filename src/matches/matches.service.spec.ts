import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('MatchesService', () => {
  let service: MatchesService;
  let mockMatchModel: any;

  beforeEach(async () => {
    mockMatchModel = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getModelToken('Match'),
          useValue: mockMatchModel,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  describe('getAllMatchLinks', () => {
    it('should return count and urls', async () => {
      mockMatchModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ matchId: '123' }, { matchId: '456' }]),
      });

      const result = await service.getAllMatchLinks();
      expect(result.count).toBe(2);
      expect(result.urls).toEqual([
        'http://localhost:3000/matches/123',
        'http://localhost:3000/matches/456',
      ]);
    });
  });

  describe('getMatchById', () => {
    const mockMatch = {
      matchId: '123',
      start: new Date('2025-01-01T00:00:00Z'),
      end: new Date('2025-01-01T01:00:00Z'),
      winningTeam: 'RED',
      score: { RED: 5, BLUE: 3 },
      RED_TEAM: {
        players: [
          { name: 'Alice', team: 'RED', kills: 2, assists: 1, totalDeaths: 1, worldDeaths: 0, friendlyFire: 0, KDA: 3, mostUsedWeapon: 'M16' },
        ],
      },
      BLUE_TEAM: {
        players: [
          { name: 'Bob', team: 'BLUE', kills: 1, assists: 0, totalDeaths: 2, worldDeaths: 0, friendlyFire: 0, KDA: 0.5, mostUsedWeapon: 'AK47' },
        ],
      },
      longestKillingStreak: { playerName: 'Alice', killsNumber: 2 },
      mvp: { mvpName: 'Alice', mostUsedWeapon: 'M16' },
    };

    it('should return match data with ranking', async () => {
      mockMatchModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockMatch) });

      const result = await service.getMatchById('123');
      expect(result.matchId).toBe('123');
      expect(result.ranking[0].name).toBe('Alice');
      expect(result.longestKillingStreak.playerName).toBe('Alice');
      expect(result.MatchMvp.mvpName).toBe('Alice');
    });

    it('should throw NotFoundException if match not found', async () => {
      mockMatchModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.getMatchById('999')).rejects.toThrow(NotFoundException);
    });
  });
});
