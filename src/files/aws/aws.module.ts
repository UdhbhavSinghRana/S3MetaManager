import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { DynamoDBService } from "./dynamodb.service";

@Module({
    providers: [S3Service, DynamoDBService],
    exports: [S3Service, DynamoDBService],
})

export class AwsModule{}