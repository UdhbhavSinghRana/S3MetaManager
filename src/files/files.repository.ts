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

@Injectable()
export class FileRepository {
    constructor(
        private readonly s3Service: S3Service,
        private readonly dynamoDBService: DynamoDBService
    ) {}

    async upload(fileName: string, file: any) {
        return this.s3Service.uploadFile('s3-meta-manager-bucket', fileName, file);
    }

    async createFileAttribute(fileName: string): Promise<CreateMetaDto> {
        const data = await this.s3Service.getObject('s3-meta-manager-bucket', fileName);

        const fileStream = Readable.from(data.Body.toString());
        
        return new Promise((resolve, reject) => {
            let rowCount = 0;
            const uniqueVal = new Map<string, Set<any>>();
            fileStream
            .pipe(csv())
            .on('data', (row) => {
                rowCount++;
                for (const [col, val] of Object.entries(row)) {
                    if (uniqueVal.has(col)) {
                        uniqueVal.get(col).add(val);
                    }
                    else {
                        uniqueVal.set(col, new Set());
                        uniqueVal.get(col).add(val);
                    }
                }
            })
            .on('end', async () => {
                const colUniqueCount = {}
                for (const [col, val] of uniqueVal.entries()) {
                    colUniqueCount[col] = val.size;
                }
                const item = {
                    id: fileName,
                    rowCount: rowCount,
                    colUniqueCount
                }
               
                this.dynamoDBService.putItem(item, 'user')
                .then((res) => {
                    resolve(item);
                })
                .catch((err) => {
                    reject(err);
                });
            })
            .on('error', () => {
                reject("Failed to parse CSV");
            })
        })
        
    }

    async retriveMeta(fileName : string) {
        const res = this.dynamoDBService.getItem(fileName, 'user'); // returns a promise
        
        return res
        .then((val) => {
            console.log(val);
            return val;
        })
        .catch((err) => {
            return err;
        })
    }

    async getFile(fileName: string) {
        const data = this.s3Service.getObject('s3-meta-manager-bucket', fileName);

        return data
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    async createZipMeta(fileName: string) {
        try {
            const archive = archiver('zip');
            const passThroughStream = new PassThrough();
    
            // Retrieve file and metadata
            console.log('Retrieving file...');
            const fileData = await this.getFile(fileName);
            console.log('File retrieved:', fileData);
    
            console.log('Retrieving metadata...');
            const metadata = await this.retriveMeta(fileName);
            console.log('Metadata retrieved:', metadata);
    
            if (!fileData.Body) {
                throw new Error('File data not found');
            }
    
            // Append file data and metadata to the archive
            console.log('Appending file data...');
            archive.append(fileData.Body as Buffer, { name: 'file.csv' });
            console.log('Appending metadata...');
            archive.append(JSON.stringify(metadata), { name: 'metadata.json' });
    
            // Finalize the archive
            console.log('Finalizing archive...');
            archive.finalize();

            // Pipe archive data to passThroughStream
            archive.pipe(passThroughStream);
    
            // Upload the archive to S3
            console.log('Uploading to S3...');
            await this.upload(`${fileName.split('.')[0]}.zip`, passThroughStream);
    
            return "Created Succefully";
        } catch (error) {
            console.error('Error creating ZIP file:', error);
            throw new Error('Error creating ZIP file');
        }
    }
}