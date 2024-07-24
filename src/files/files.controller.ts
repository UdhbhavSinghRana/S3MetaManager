import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    @Get()
    getFiles() {
        return 'This action returns all files';
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file : Express.Multer.File) {
        console.log(file);
        return file;    
    }
}
