import { Injectable } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { FileRepository } from './files.repository';

@Injectable()
export class FilesService {
    constructor(
        public fileRepository: FileRepository
    ) {}

    async upload(fileName: string, file: any) {
        return this.fileRepository.upload(fileName, file);
    }

    async createFileAttribute(fileName: string): Promise<CreateMetaDto> {
        return this.fileRepository.createFileAttribute(fileName);
    }

    async createZipMeta(fileName: string) {
        return this.fileRepository.createFileAttribute(fileName);
    }    
}
