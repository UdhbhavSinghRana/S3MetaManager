import { Injectable } from "@nestjs/common";
import { DynamoDBRepository } from "./dynamodb.repository";


@Injectable()
export class DynamoDBService {
    constructor(public dynamoDbRepository : DynamoDBRepository) {
    }

    async getItem (key: any, tableName: string): Promise<any> {
        return this.dynamoDbRepository.getItem(key, tableName);
    }

    async putItem (item: any, tableName: string): Promise<any> {
        return this.dynamoDbRepository.putItem(item, tableName);
    }
}