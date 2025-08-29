import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GlobalRankingService } from './global-ranking.service';
import { GlobalRanking } from 'src/mongo-connector/global-ranking.schema';

describe('GlobalRankingService', () => {
  let service: GlobalRankingService;
  let model: any;

  const mockGlobalRankingModel = {
    updateOne: jest.fn(),
    find: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalRankingService,
        {
          provide: getModelToken(GlobalRanking.name),
          useValue: mockGlobalRankingModel,
        },
      ],
    }).compile();

    service = module.get<GlobalRankingService>(GlobalRankingService);
    model = module.get(getModelToken(GlobalRanking.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateFromMatch', () => {
    it('should call updateOne for each player', async () => {
      const players = [
        { name: 'Alice', kills: 5, totalDeaths: 2, worldDeaths: 0, assists: 3 },
        { name: 'Bob', kills: 2, totalDeaths: 1, worldDeaths: 0, assists: 1 },
      ];

      await service.updateFromMatch(players);

      expect(model.updateOne).toHaveBeenCalledTimes(players.length);
      expect(model.updateOne).toHaveBeenCalledWith(
        { playerName: 'Alice' },
        {
          $inc: {
            kills: 5,
            deaths: 2,
            assists: 3,
            matchesPlayed: 1,
          },
        },
        { upsert: true },
      );
      expect(model.updateOne).toHaveBeenCalledWith(
        { playerName: 'Bob' },
        {
          $inc: {
            kills: 2,
            deaths: 1,
            assists: 1,
            matchesPlayed: 1,
          },
        },
        { upsert: true },
      );
    });
  });

  describe('getTopPlayers', () => {
    it('should return top players sorted by KDA with 2 decimals', async () => {
      const playersFromDb = [
        { playerName: 'Alice', kills: 5, assists: 2, deaths: 2, _id: '1', __v: 0, matchesPlayed: 2 },
        { playerName: 'Bob', kills: 3, assists: 1, deaths: 1, _id: '2', __v: 0, matchesPlayed: 1 },
      ];

      model.exec.mockResolvedValue(playersFromDb);

      const result = await service.getTopPlayers();

      expect(result).toEqual([
        { playerName: 'Alice', kills: 5, assists: 2, deaths: 2, kda: 2.29, matchesPlayed: 2 },
        { playerName: 'Bob', kills: 3, assists: 1, deaths: 1, kda: 2.25, matchesPlayed: 1 },
      ]);
    });

    it('should limit the number of returned players', async () => {
      const playersFromDb = [
        { playerName: 'Alice', kills: 5, assists: 2, deaths: 2, _id: '1', __v: 0 },
        { playerName: 'Bob', kills: 3, assists: 1, deaths: 1, _id: '2', __v: 0 },
      ];

      model.exec.mockResolvedValue(playersFromDb);

      const result = await service.getTopPlayers(1);

      expect(result).toHaveLength(1);
      expect(result[0].playerName).toBe('Alice');
    });
  });
});
