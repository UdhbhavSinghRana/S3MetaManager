import { Injectable } from "@nestjs/common";
import { S3Repository } from "./s3.repository";

@Injectable()
export class S3Service {
    constructor(public s3Repository: S3Repository) {}

    async uploadFile(bucketName : string, key: string, body : Buffer) {
        return this.s3Repository.uploadFile(bucketName, key, body);
    }

    async getObject(bucketName: string, key: string): Promise<any> {
        return this.s3Repository.getObject(bucketName, key);
    }
}