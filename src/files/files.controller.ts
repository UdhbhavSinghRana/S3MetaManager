import { Controller, Get, Headers, Param, Post, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response as Res } from 'express';

@Controller('files')
export class FilesController {
    constructor (private readonly filesService: FilesService) {}

    @Post('/:filename')
    async createFiles(@Param('filename') fileName : string) {
        return await this.filesService.createFileAttribute(fileName);
    }

    @Post('/meta/:filename')
    async createZipMeta(@Param('filename') filename: string) {
        try {
            const result = this.filesService.createZipMeta(filename);
            return result;
        }
        catch(err) {
            return err;
        }
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file : Express.Multer.File) {
        try {
            await this.filesService.upload(file.originalname, file.buffer);   
            return "Uploaded Successfully"
        }
        catch(err) {
            return err;
        }
    }
}
