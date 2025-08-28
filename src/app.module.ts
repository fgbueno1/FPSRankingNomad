import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploaderModule } from './uploader/uploader.module';
import { MongoConnectorModule } from './mongo-connector/mongo-connector.module';

@Module({
  imports: [UploaderModule, MongoConnectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
