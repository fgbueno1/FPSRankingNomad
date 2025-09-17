// uploader.controller.ts
import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from "@nestjs/common";
  import { FileInterceptor } from "@nestjs/platform-express";
  import { UploaderService } from "./uploader.service";
  import { NoFileError, InvalidFormatError, InvalidLogError } from "./uploader.errors";
  
  @Controller("upload")
  export class UploaderController {
    constructor(private readonly uploaderService: UploaderService) {}
  
    @Post("log")
    @UseInterceptors(FileInterceptor("file"))
    async uploadLog(@UploadedFile() file: Express.Multer.File) {
      try {
        const status = await this.uploaderService.parseLogFile(file);
  
        return {
          status: "accepted",
          code: 202,
          message: "File parsed and queued for processing",
        };
      } catch (err) {
        if (err instanceof NoFileError) {
          throw new BadRequestException(err.message);
        }
        if (err instanceof InvalidFormatError) {
          throw new BadRequestException(err.message);
        }
        if (err instanceof InvalidLogError) {
          throw new BadRequestException(err.message);
        }
        throw err;
    }
  }
}