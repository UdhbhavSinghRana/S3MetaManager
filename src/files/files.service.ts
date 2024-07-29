import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import * as csv from 'csv-parser'; 
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Meta, MetaKey } from 'src/metadata/metadata.interface';
import {v4 as uuidv4} from 'uuid';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { PassThrough } from 'stream';
import * as archiver from 'archiver'

@Injectable()
export class FilesService {
    private readonly s3Client : S3Client;
    private s3: S3;
    private readonly dynamoDb: DocumentClient;
    @InjectModel('Meta')
    private metaModel: Model<Meta, MetaKey>

    constructor(private readonly configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error('AWS configuration is not defined in the configuration');
        }
        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        
        this.s3 = new S3({
            region,
            accessKeyId,
            secretAccessKey
        })

        this.dynamoDb = new DocumentClient({
            region
        })
    }

    async upload(fileName: string, file: Buffer) {
        await this.s3Client.send(   
            new PutObjectCommand({
                Bucket: 's3-meta-manager-bucket',
                Key: fileName,
                Body: file,
            }),
        );
    }

    async createFileAttribute(fileName: string) {
        const data = await this.s3.getObject(
            {
                Bucket: 's3-meta-manager-bucket',
                Key: fileName
            }
        ).promise();

        const fileStream = Readable.from(data.Body.toString());
        
        return new Promise((res, rej) => {
            let idCount = 0;
            let rowCount = 0;
            fileStream
            .pipe(csv())
            .on('data', (row) => {
                rowCount++;
                if (row.id) {
                    idCount++;
                }
            })
            .on('end', () => {
                const params = {
                    TableName: 'user',
                    Item: {
                        id: fileName,
                        rowCount: rowCount,
                        idCount: idCount
                    }
                }
                this.dynamoDb.put(params, (err) => {
                    if (err) {
                        rej("Failed to store data");
                    }
                    else {
                        res({
                            fileName,
                            idCount,
                            rowCount
                        });
                    }
                })
            })
            .on('error', () => {
                rej("Failed to parse CSV");
            })
        })
        
    }

    async retriveMeta(filename: string) {
        const res = this.dynamoDb.get({
            TableName: 'user',
            Key: {
                id: filename,
            },
        })
        
        return res.promise()
        .then((val) => {
            console.log(val);
            return val;
        })
        .catch((err) => {
            return err;
        })
    }

    async getFile(fileName: string) {
        const data = await this.s3.getObject(
            {
                Bucket: 's3-meta-manager-bucket',
                Key: fileName
            }
        ).promise()
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })

        return data;
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
            const upload = this.s3.upload({
                Bucket: 's3-meta-manager-bucket',
                Key: `${fileName.split('.')[0]}.zip`, // Name the zip file
                Body: passThroughStream,
                ContentType: 'application/zip',
            }).promise();
    
            return "Created Succefully";
        } catch (error) {
            console.error('Error creating ZIP file:', error);
            throw new Error('Error creating ZIP file');
        }
    }    
}
