import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'global-ranking' })
export class GlobalRanking extends Document {
  @Prop({ required: true, unique: true })
  playerName: string;

  @Prop({ default: 0 })
  kills: number;

  @Prop({ default: 0 })
  deaths: number;

  @Prop({ default: 0 })
  assists: number;

  @Prop({ default: 0 })
  matchesPlayed: number;
  
}

export const GlobalRankingSchema = SchemaFactory.createForClass(GlobalRanking);