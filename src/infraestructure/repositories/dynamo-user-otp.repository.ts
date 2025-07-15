import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';

@Injectable()
export class DynamoUserOtpRepository implements UserOtpRepository {
  private readonly tableName = 'UserOtp';

  constructor(
    @Inject('DYNAMO_CLIENT') private readonly dynamo: DynamoDBDocumentClient
  ) {}

  async save(userId: string,  secret: string, typeOtp: 'TOTP' | 'HOTP', createdAt: string, expiresAt?: string, counter?: number): Promise<void> {
    const item: Record<string, any> = {
      userId,
      secret,
      typeOtp,
      createdAt,
    };
    
    if (expiresAt) {
      item.expiresAt = expiresAt;
    }

    if (counter !== undefined) {
      item.counter = counter;
    }
    
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });

    await this.dynamo.send(command);
  }

  async findByUserId(userId: string): Promise<any> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId },
    });

    const result = await this.dynamo.send(command);
    return result.Item || null;
  }

  async updateCounter(userId: string, counter: number, updatedAt: string): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: 'SET #counter = :counter, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#counter': 'counter', //counter é um nome reservado, então precisou ser tratado
      },
      ExpressionAttributeValues: {
        ':counter': counter,
        ':updatedAt': updatedAt,
      },
    });

    await this.dynamo.send(command);
  }
}
