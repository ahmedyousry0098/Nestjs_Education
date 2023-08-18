import { Controller, Post, UseInterceptors, UploadedFile, Body, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/upload')
export class UploadController {
    constructor(private _UploadService: UploadService) {}
}
