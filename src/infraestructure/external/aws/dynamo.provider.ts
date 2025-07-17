import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isRunningLocally = !!process.env.IS_OFFLINE || process.env.NODE_ENV === 'development';

export const dynamoProvider = {
  provide: 'DYNAMO_CLIENT',
  useFactory: () => {
    const region = process.env.AWS_REGION || 'us-east-1';

    const client = new DynamoDBClient({
      region,
      ...(isRunningLocally && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    });

    return DynamoDBDocumentClient.from(client);
  },
};
