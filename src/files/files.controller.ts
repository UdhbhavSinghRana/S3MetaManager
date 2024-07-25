import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor (private readonly filesService: FilesService) {}

    @Get('/:filename')
    getFiles(@Param('filename') fileName : string) {
        console.log(fileName);
        return this.filesService.createFileAttribute(fileName);
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file : Express.Multer.File) {
        await this.filesService.upload(file.originalname, file.buffer);   
    }
}
