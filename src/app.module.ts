import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploaderModule } from './uploader/uploader.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectorModule } from './mongo-connector/mongo-connector.module';
import { MatchStatsService } from './match-stats/match-stats.service';
import { MatchStatsModule } from './match-stats/match-stats.module';

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
            MatchStatsModule
            ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
