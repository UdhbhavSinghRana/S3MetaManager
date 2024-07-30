import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

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
            Bucker: bucketName,
            Key: key,
            Expires: 60 * 5,
        }

        return this.s3.getSignedUrl('putObject', params);
    }
}