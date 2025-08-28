import { Injectable } from '@nestjs/common';
import {
  FpsLogsDto,
  MatchStartLog,
  MatchEndLog,
  KillLog,
  WorldKillLog,
} from './fps-logs.dto';

@Injectable()
export class UploaderService {
  parseLogFile(file: Express.Multer.File): FpsLogsDto[] {
    const content = file.buffer.toString('utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    return lines.map((line) => this.parseLine(line));
  }

  // parseLine parses line by line, and add it to the respective class strcture
  private parseLine(line: string): FpsLogsDto {
    // Common timestamp extraction
    const [datePart, timePart, , ...rest] = line.split(' ');
    const timestamp = this.parseDateTime(`${datePart} ${timePart}`);
    const message = rest.join(' ');

    // Match start
    const matchStartRegex = /^New match (\d+) has started$/;
    const matchStart = message.match(matchStartRegex);
    if (matchStart) {
      return {
        type: 'MATCH_START',
        timestamp,
        matchId: matchStart[1],
      } as MatchStartLog;
    }

    // Match end
    const matchEndRegex = /^Match (\d+) has ended$/;
    const matchEnd = message.match(matchEndRegex);
    if (matchEnd) {
      return {
        type: 'MATCH_END',
        timestamp,
        matchId: matchEnd[1],
      } as MatchEndLog;
    }

    // Player kill
    const killRegex =
        /^<(\w+)> (\w+) killed <(\w+)> (\w+) using (\w+)(?: assisted by <(\w+)> (\w+))?$/;
    const kill = message.match(killRegex);
    if (kill) {
        return {
        type: 'KILL',
        timestamp,
        killerTeam: kill[1],
        killerName: kill[2],
        victimTeam: kill[3],
        victimName: kill[4],
        weapon: kill[5],
        assistTeam: kill[6] || undefined,
        assistName: kill[7] || undefined,
        } as KillLog;
    }

    // World kill
    const worldKillRegex =
      /^<WORLD> killed <(\w+)> (\w+) by (.+)$/;
    const worldKill = message.match(worldKillRegex);
    if (worldKill) {
      return {
        type: 'WORLD_KILL',
        timestamp,
        victimTeam: worldKill[1],
        victimName: worldKill[2],
        cause: worldKill[3],
      } as WorldKillLog;
    }

    throw new Error(`Unrecognized log format: ${line}`);
  }

  private parseDateTime(datetime: string): Date {
    const [date, time] = datetime.split(' ');
    const [day, month, year] = date.split('/');
    return new Date(`${year}-${month}-${day}T${time}`);
  }
}