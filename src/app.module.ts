import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploaderModule } from './uploader/uploader.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectorModule } from './mongo-connector/mongo-connector.module';
import { MatchStatsService } from './match-stats/match-stats.service';
import { MatchStatsModule } from './match-stats/match-stats.module';
import { MatchesModule } from './matches/matches.module';
import { GlobalRankingController } from './global-ranking/global-ranking.controller';
import { GlobalRankingModule } from './global-ranking/global-ranking.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './key-guard/key-guard.guard';

@Module({
  imports: [UploaderModule, 
            ConfigModule.forRoot({
              isGlobal: true,
              envFilePath: 'dev.env'
            }),
            MongooseModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
              }),
            }),
            MongoConnectorModule,
            MatchStatsModule,
            MatchesModule,
            GlobalRankingModule,
            ],
  controllers: [AppController],
  providers: [HealthService, {
    provide: APP_GUARD,
    useClass: ApiKeyGuard,
  },],
})
export class AppModule {}
