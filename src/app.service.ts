import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';


@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('DYNAMO_CLIENT')
    private readonly dynamo: DynamoDBDocumentClient,
  ) {}

  async onModuleInit() {
    try {
      const result = await this.dynamo.send(new ListTablesCommand({}));
      console.log('Cheguei até aqui na tabela:', result.TableNames);
    } catch (error) {
      console.error('Erro ao conectar no DynamoDB:', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
