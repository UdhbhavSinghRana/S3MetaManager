import { Body, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

@Injectable()
export class S3Service {
    private s3: S3;

    constructor(private readonly configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error('AWS configuration is not defined in the configuration');
        }

        this.s3 = new S3({
            region,
            accessKeyId,
            secretAccessKey
        })
    }

    generatePresignedUrl(bucketName: string, key: string) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Expires: 60 * 5,
        }

        return this.s3.getSignedUrl('putObject', params);
    }

    async uploadFile(bucketName : string, key: string, body : Buffer) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: body,
        }

        return await this.s3.upload(params).promise();
    }

    async getObject(bucketName: string, key: string): Promise<any> {
        console.log(key);   
        const data = await this.s3.getObject(
            {
                Bucket: bucketName,
                Key: key
            }
        ).promise();

        return data;
    }
}