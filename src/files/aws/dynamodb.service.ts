import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentClient } from "aws-sdk/clients/dynamodb";


@Injectable()
export class DynamoDBService {
    private readonly dynamoDb: DocumentClient;

    constructor(private readonly configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION');

        this.dynamoDb = new DocumentClient({
            region
        })
    }

    async getItem (key: any, tableName: string): Promise<any> {
        const res = this.dynamoDb.get({
            TableName: tableName,
            Key: {
                id: key,
            },
        }).promise()

        return res;
    }

    async putItem (item: any, tableName: string): Promise<any> {
        const params = {
            TableName: tableName,
            Item: item
        }

        return this.dynamoDb.put(params).promise()
    }
}