import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchLog } from 'src/uploader/fps-logs.dto';
import { Match, MatchDocument } from '../mongo-connector/match-details.schema';
import { GlobalRankingService } from 'src/global-ranking/global-ranking.service';

@Injectable()
export class MatchStatsService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private readonly globalRankingService: GlobalRankingService,
  ) {}

  // calculateAndSave calculates all match statitcs and save it to mongoDB
  async calculateAndSave(matches: MatchLog[]) {
    const results = [];

    for (const match of matches) {
      const stats = this.calculateMatchStats(match);
      const redPlayers = stats.players.filter((p) => p.team === 'RED');
      const bluePlayers = stats.players.filter((p) => p.team === 'BLUE');
      const results: MatchDocument[] = [];
      const dbMatch: Partial<Match> = {
        matchId: match.matchId,
        start: match.start,
        end: match.end,
        winningTeam: this.getWinningTeam(stats.players),
        score: this.getScore(stats.players),
        RED_TEAM: { players: redPlayers },
        BLUE_TEAM: { players: bluePlayers },
        longestKillingStreak: stats.longestKillingStreak,
        mvp: stats.mvp
      };

      const saved = await this.matchModel.findOneAndUpdate(
        { matchId: dbMatch.matchId },
        dbMatch,
        { upsert: true, new: true },
      );

      await this.globalRankingService.updateFromMatch(stats.players);

      results.push(saved);
    }

    return results;
  }

  // calculateMatchStats calculate the events such as k/d/a, kill streak, and match mvp
  private calculateMatchStats(match: MatchLog) {
    const playerStats: Record<string, any> = {};
    let firstBlood: string | null = null;
    const killTimes: Record<string, number[]> = {};

    for (const event of match.events) {
      if (event.type === 'KILL') {

        if (!firstBlood) firstBlood = event.killerName;

        playerStats[event.killerName] ??= this.initPlayer(event.killerName, event.killerTeam);
        playerStats[event.killerName].kills++;

        playerStats[event.victimName] ??= this.initPlayer(event.victimName, event.victimTeam);
        playerStats[event.victimName].deaths++;

        if (event.assistName) {
          playerStats[event.assistName] ??= this.initPlayer(event.assistName, event.assistTeam!);
          playerStats[event.assistName].assists++;
        }

        playerStats[event.killerName].weapons[event.weapon] =
          (playerStats[event.killerName].weapons[event.weapon] || 0) + 1;

        if (event.killerTeam === event.victimTeam) {
          playerStats[event.killerName].friendlyFire++;
        }

        killTimes[event.killerName] ??= [];
        killTimes[event.killerName].push(new Date(event.timestamp).getTime());
      }

      if (event.type === 'WORLD_KILL') {
        playerStats[event.victimName] ??= this.initPlayer(event.victimName, event.victimTeam);
        playerStats[event.victimName].worldDeaths++;
        playerStats[event.victimName].deaths++;
      }
    }

    for (const p of Object.values(playerStats)) {
        const effectiveDeaths = p.deaths - p.worldDeaths;
        const rawKDA =
          effectiveDeaths > 0
            ? (p.kills + (p.assists/2)) / effectiveDeaths - p.friendlyFire
            : (p.kills + (p.assists/2)) - p.friendlyFire;
      
        p.KDA = Math.max(0, Math.round(rawKDA * 100) / 100);

        p.awards = [];
    
        if (p.deaths === 0) p.awards.push('NoDeath');
    
        if (killTimes[p.name]?.length >= 5) {
          const times = killTimes[p.name].sort((a, b) => a - b);
          for (let i = 4; i < times.length; i++) {
            if (times[i] - times[i - 4] <= 60_000) {
              p.awards.push('SpeedKiller');
              break;
            }
          }
        }   
        if (p.name === firstBlood) p.awards.push('FirstBlood');
      }

    const mvpPlayer = Object.values(playerStats).reduce((best: any, p: any) => {
      return !best || p.KDA > best.KDA ? p : best;
    }, null);
    const mvp = {
        mvpName: mvpPlayer?.name || null,
        mostUsedWeapon: mvpPlayer
          ? Object.entries(mvpPlayer.weapons as Record<string, number>)
              .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
          : null,
      };

    let streaks: Record<string, number> = {};
    let longestStreak = { playerName: '', killsNumber: 0 };

    for (const event of match.events) {
      if (event.type === 'KILL') {
        streaks[event.killerName] = (streaks[event.killerName] || 0) + 1;
        if (streaks[event.killerName] > longestStreak.killsNumber) {
          longestStreak = { playerName: event.killerName, killsNumber: streaks[event.killerName] };
        }
      }
      if (event.type === 'KILL' || event.type === 'WORLD_KILL') {
        streaks[event.victimName] = 0;
      }
    }

    return {
      players: Object.values(playerStats).map((p: any) => ({
        name: p.name,
        team: p.team,
        kills: p.kills,
        totalDeaths: p.deaths,
        assists: p.assists,
        worldDeaths: p.worldDeaths,
        friendlyFire: p.friendlyFire,
        KDA: p.KDA,
        mostUsedWeapon: Object.entries(p.weapons as Record<string, number>).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
        awards: p.awards,
      })),
      mvp,
      longestKillingStreak: longestStreak,
    };
  }

  // initPlayer init a new Player with all stats reseted
  private initPlayer(name: string, team: string) {
    return {
      name,
      team,
      kills: 0,
      deaths: 0,
      assists: 0,
      worldDeaths: 0,
      friendlyFire: 0,
      weapons: {} as Record<string, number>,
    };
  }

  //getScore calculate the amount of kills from each team
  private getScore(players: any[]) {
    const score: Record<string, number> = {};
    for (const p of players) {
      score[p.team] = (score[p.team] || 0) + p.kills;
    }
    return score;
  }

  //getWinningTeam returns the team with most kills, so the winning team
  private getWinningTeam(players: any[]) {
    const score = this.getScore(players);
    return Object.entries(score).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }
}
