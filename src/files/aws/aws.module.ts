import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { DynamoDBService } from "./dynamodb.service";
import { ConfigService } from "@nestjs/config";
import { S3Repository } from "./s3.repository";
import { DynamoDBRepository } from "./dynamodb.repository";

@Module({
    providers: [S3Service, DynamoDBService, S3Repository, DynamoDBRepository, ConfigService],
    exports: [S3Service, DynamoDBService, S3Repository],
})

export class AwsModule{}