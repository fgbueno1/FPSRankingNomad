import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from 'src/mongo-connector/match-details.schema';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  async getAllMatchLinks(): Promise<{ count: number; urls: string[] }> {
    const matches = await this.matchModel.find({}, 'matchId').exec();
    const urls = matches.map(m => `http://localhost:3000/matches/${m.matchId}`);
    return {
      count: matches.length,
      urls,
    };
  }

  async getMatchById(id: string) {
    const match = await this.matchModel.findOne({ matchId: id }).exec();
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    const allPlayers = [...match.RED_TEAM.players, ...match.BLUE_TEAM.players];

    const longestKillingStreak = {
        playerName: match.longestKillingStreak.playerName,
        killsNumber: match.longestKillingStreak.killsNumber,
      };
      

    const ranking = allPlayers
    .map(p => ({
      name: p.name,
      team: p.team,
      kills: p.kills,
      assists: p.assists,
      deaths: p.totalDeaths,
      worldDeaths: p.worldDeaths,
      friendlyFire: p.friendlyFire,
      KDA: p.KDA,
      mostUsedWeapon: p.mostUsedWeapon,
      awards: p.awards
    }))
    .sort((a, b) => b.KDA - a.KDA);

  return {
    matchId: match.matchId,
    start: match.start,
    end: match.end,
    winningTeam: match.winningTeam,
    score: match.score,
    MatchMvp: match.mvp,
    longestKillingStreak,
    ranking,
  };
  }
}
