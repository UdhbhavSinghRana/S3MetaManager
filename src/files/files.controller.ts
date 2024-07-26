import { Controller, Get, Headers, Param, Post, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response as Res } from 'express';

@Controller('files')
export class FilesController {
    constructor (private readonly filesService: FilesService) {}

    @Post('/:filename')
    createFiles(@Param('filename') fileName : string) {
        console.log(fileName);
        return this.filesService.createFileAttribute(fileName);
    }

    @Post('/meta/:filename')
    async createZipMeta(@Param('filename') filename: string, @Response() res: Res) {
        const result = await this.filesService.createZipMeta(filename);

        res.set({
            'Content-Type': result.ContentType,
        })

        res.send(result.Body);
        return res;
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file : Express.Multer.File) {
        await this.filesService.upload(file.originalname, file.buffer);   
    }
}
