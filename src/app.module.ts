import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [UploaderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
