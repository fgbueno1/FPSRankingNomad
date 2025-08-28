import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UploaderService } from './uploader.service';
  
  @Controller('upload')
  export class UploaderController {
    constructor(private readonly uploaderService: UploaderService) {}
  
    @Post('log')
    @UseInterceptors(FileInterceptor('file'))
    async uploadLog(@UploadedFile() file: Express.Multer.File) {
      return this.uploaderService.parseLogFile(file);
    }
  }