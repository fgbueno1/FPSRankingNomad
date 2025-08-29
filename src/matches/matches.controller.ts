import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from 'src/mongo-connector/match-details.schema'

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getMatches() {
    return this.matchesService.getAllMatchLinks();
  }

  @Get(':id')
  async getMatch(@Param('id') id: string) {
    return this.matchesService.getMatchById(id);
  }
}
