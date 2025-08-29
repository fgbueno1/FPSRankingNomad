import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema()
export class PlayerStats {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  team: string;

  @Prop({ default: 0 })
  kills: number;

  @Prop({ default: 0 })
  totalDeaths: number;

  @Prop({ default: 0 })
  worldDeaths: number;

  @Prop({ default: 0 })
  assists: number;

  @Prop({ default: 0 })
  friendlyFire: number;

  @Prop()
  mostUsedWeapon: string;

  @Prop({ type: [String], default: [] })
  awards: string[];
}

@Schema()
export class LongestKillingStreak {
  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true })
  killsNumber: number;
}

@Schema()
export class TeamStats {
  @Prop({ type: [PlayerStats], default: [] })
  players: PlayerStats[];
}

@Schema()
export class Match {
  @Prop({ required: true, unique: true })
  matchId: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop()
  winningTeam: string;

  @Prop({
    type: Object,
    default: { mvpName: null, mostUsedWeapon: null },
  })
  mvp: { mvpName: any; mostUsedWeapon: string | null };

  @Prop({ type: Object })
  score: Record<string, number>;

  @Prop({ type: TeamStats, default: () => ({ players: [] }) })
  RED_TEAM: TeamStats;

  @Prop({ type: TeamStats, default: () => ({ players: [] }) })
  BLUE_TEAM: TeamStats;

  @Prop()
  longestKillingStreak: LongestKillingStreak;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
