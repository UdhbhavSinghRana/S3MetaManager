import { Controller, Get } from '@nestjs/common';

@Controller('files')
export class FilesController {
    @Get()
    getFiles() {
        return 'This action returns all files';
    }
}
