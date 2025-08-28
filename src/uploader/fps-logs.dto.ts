export type FpsLogsDto =
  | MatchStartLog
  | MatchEndLog
  | KillLog
  | WorldKillLog;

export class MatchStartLog {
  type: 'MATCH_START';
  timestamp: Date;
  matchId: string;
}

export class MatchEndLog {
  type: 'MATCH_END';
  timestamp: Date;
  matchId: string;
}

export class KillLog {
  type: 'KILL';
  timestamp: Date;
  killerTeam: string;
  killerName: string;
  victimTeam: string;
  victimName: string;
  weapon: string;
}

export class WorldKillLog {
  type: 'WORLD_KILL';
  timestamp: Date;
  victimTeam: string;
  victimName: string;
  cause: string;
}