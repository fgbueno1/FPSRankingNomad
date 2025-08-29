import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GlobalRankingService } from './global-ranking.service';

@Controller('global-ranking')
export class GlobalRankingController {
  constructor(private readonly rankingService: GlobalRankingService) {}

  @Get()
  async getTop(@Query('limit') limit: string) {
    const top = await this.rankingService.getTopPlayers(Number(limit) || 10);
    return {
      count: top.length,
      players: top,
    };
  }
}
