import { Header, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import * as csv from 'csv-parser'; 
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PassThrough } from 'stream';
import * as archiver from 'archiver'
import { CreateMetaDto } from './dto/create-meta.dto';
import { GetFileDto } from './dto/get-file.dto';
import { S3Service } from './aws/s3.service';
import { DynamoDBService } from './aws/dynamodb.service';
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
