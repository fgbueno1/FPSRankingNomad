import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MatchStatsService } from './match-stats.service';
import { Match } from '../mongo-connector/match-details.schema';
import { GlobalRankingService } from '../global-ranking/global-ranking.service'; // adjust path

const mockMatchModel = {
  findOneAndUpdate: jest.fn(),
};

const mockGlobalRankingService = {
  updateFromMatch: jest.fn(),
};

describe('MatchStatsService', () => {
  let service: MatchStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchStatsService,
        {
          provide: getModelToken(Match.name),
          useValue: mockMatchModel,
        },
        {
          provide: GlobalRankingService,
          useValue: mockGlobalRankingService,
        },
      ],
    }).compile();

    service = module.get<MatchStatsService>(MatchStatsService);
    jest.clearAllMocks();
  });

  describe('calculateMatchStats', () => {
    it('should calculate stats correctly', () => {
      const match = {
        matchId: '123',
        start: new Date(),
        end: new Date(),
        events: [
          { type: 'KILL', killerName: 'Ethan', killerTeam: 'RED', victimName: 'Mia', victimTeam: 'BLUE', weapon: 'M16', timestamp: new Date().toISOString() },
          { type: 'WORLD_KILL', victimName: 'Mia', victimTeam: 'BLUE', timestamp: new Date().toISOString() },
        ],
      };

      const stats = (service as any).calculateMatchStats(match);

      expect(stats.players).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Ethan', kills: 1, team: 'RED', mostUsedWeapon: 'M16' }),
          expect.objectContaining({ name: 'Mia', totalDeaths: 2, team: 'BLUE' }),
        ]),
      );
      expect(stats.mvp).toEqual({ mostUsedWeapon: 'M16', mvpName: 'Ethan' });
      expect(stats.longestKillingStreak).toEqual({ playerName: 'Ethan', killsNumber: 1 });
    });
  });

  describe('getScore', () => {
    it('should return team scores', () => {
      const players = [
        { team: 'RED', kills: 3 },
        { team: 'BLUE', kills: 2 },
        { team: 'RED', kills: 1 },
      ];
      const score = (service as any).getScore(players);
      expect(score).toEqual({ RED: 4, BLUE: 2 });
    });
  });

  describe('getWinningTeam', () => {
    it('should return winning team', () => {
      const players = [
        { team: 'RED', kills: 5 },
        { team: 'BLUE', kills: 3 },
      ];
      const team = (service as any).getWinningTeam(players);
      expect(team).toBe('RED');
    });
  });
});
