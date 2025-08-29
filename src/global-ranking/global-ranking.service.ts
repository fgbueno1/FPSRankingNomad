import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalRanking } from 'src/mongo-connector/global-ranking.schema';

@Injectable()
export class GlobalRankingService {
  constructor(
    @InjectModel(GlobalRanking.name)
    private globalRankingModel: Model<GlobalRanking>,
  ) {}

  // updateFromMatch updates the player infos in the global ranking
  async updateFromMatch(players: any[]): Promise<void> {
    for (const player of players) {
      await this.globalRankingModel.updateOne(
        { playerName: player.name },
        {
          $inc: {
            kills: player.kills,
            deaths: player.totalDeaths - player.worldDeaths,
            assists: player.assists,
            matchesPlayed: 1,
          },
        },
        { upsert: true },
      );
    }
  }

  //getTopPlayers get the top players globally givin a limit. It adjust the kda based on matches played using the Bayesian Statistics
  async getTopPlayers(limit = 10) {
    const players = await this.globalRankingModel.find().lean().exec();
  
    const priorKDA = 2.0;     //baseline KDA
    const priorMatches = 5;   //"virtual matches" for small-sample adjustment.
  
    return players
      .map(p => {
        const effectiveDeaths = p.deaths;
        const rawKDA =
          effectiveDeaths > 0
            ? (p.kills + (p.assists / 2)) / effectiveDeaths
            : (p.kills + (p.assists / 2));

        const adjustedKDA =
          (rawKDA * p.matchesPlayed + priorKDA * priorMatches) /
          (p.matchesPlayed + priorMatches);
  
        const { _id, __v, ...rest } = p;
        return {
          ...rest,
          kda: Math.round(adjustedKDA * 100) / 100,
        };
      })
      .sort((a, b) => b.kda - a.kda)
      .slice(0, limit);
  }
}
