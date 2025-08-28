import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from './match-details.schema';

@Injectable()
export class MongoConnectorService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  async saveMatch(matchData: Match): Promise<Match> {
    const match = new this.matchModel(matchData);
    return match.save();
  }

  async getAllMatches(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }

  async getMatchById(matchId: string): Promise<Match | null> {
    return this.matchModel.findOne({ matchId }).exec();
  }

  async updateMatch(matchId: string, updateData: Partial<Match>): Promise<Match | null> {
    return this.matchModel.findOneAndUpdate({ matchId }, updateData, { new: true }).exec();
  }

  async deleteMatch(matchId: string): Promise<Match | null> {
    return this.matchModel.findOneAndDelete({ matchId }).exec();
  }
}
