import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import * as csv from 'csv-parser'; 
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Meta, MetaKey } from 'src/metadata/metadata.interface';
import {v4 as uuidv4} from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class FilesService {
    private readonly s3Client : S3Client;
    private s3: S3;
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
        let idCount = 0;
        let rowCount = 0;
        return new Promise((res, rej) => {
            fileStream
            .pipe(csv())
            .on('data', (row) => {
                rowCount++;
                if (row.id) {
                    idCount++;
                }
            })
            .on('end', () => {
                this.metaModel.create({
                    fileName: fileName,
                    id: uuidv4(),
                    idCount: idCount,
                    rowCount: rowCount
                })
                res({ fileName, idCount, rowCount })
            })
            .on('error', rej)
        })
    }

    async createZipMeta(filename: string) {
        return "hello"
    }
}
