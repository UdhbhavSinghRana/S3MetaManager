import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor (private readonly filesService: FilesService) {}

    @Get()
    getFiles() {
        return 'This action returns all files';
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file : Express.Multer.File) {
        await this.filesService.upload(file.originalname, file.buffer);   
    }
}
