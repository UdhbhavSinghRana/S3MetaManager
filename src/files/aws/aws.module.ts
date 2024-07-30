import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { DynamoDBService } from "./dynamodb.service";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [S3Service, DynamoDBService, ConfigService],
    exports: [S3Service, DynamoDBService],
})

export class AwsModule{}