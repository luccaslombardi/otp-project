import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { createDecipheriv } from 'crypto';

@Injectable()
export class DynamoUserOtpRepository implements UserOtpRepository {
  private readonly tableName = 'UserOtp';

  constructor(
    @Inject('DYNAMO_CLIENT') private readonly dynamo: DynamoDBDocumentClient
  ) {}

  async save(userId: string,  secret: string, typeOtp: 'TOTP' | 'HOTP', createdAt?: string, expiresAt?: string, counter?: number, updatedAt?: string): Promise<void> {
    const item: Record<string, any> = {
      userId,
      secret,
      typeOtp,
    };

    if (createdAt) {
      item.createdAt = createdAt;
    }
    
    if (expiresAt) {
      item.expiresAt = expiresAt;
    }

    if (counter !== undefined) {
      item.counter = counter;
    }

    if (updatedAt) {
      item.updatedAt = updatedAt;
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

  async updateOtpMetadata (userId: string, typeOtp: 'TOTP' | 'HOTP', updatedAt: string, expiresAt?: string) {
    let updateExpression = 'SET typeOtp = :typeOtp, updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = {
      ':typeOtp': typeOtp,
      ':updatedAt': updatedAt,
    };

    if (expiresAt) {
      updateExpression += ', expiresAt = :expiresAt';
      expressionAttributeValues[':expiresAt'] = expiresAt;
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await this.dynamo.send(command)
  }
}
