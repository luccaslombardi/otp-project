import { Module } from '@nestjs/common';
import { dynamoProvider } from './infraestructure/external/aws/dynamo.provider';
import { DynamoUserOtpRepository } from './infraestructure/repositories/dynamo-user-otp.repository';

@Module({
  providers: [
    dynamoProvider,
    {
      provide: 'UserOtpRepository',
      useClass: DynamoUserOtpRepository,
    },
  ],
  exports: ['UserOtpRepository', dynamoProvider],
})
export class DatabaseModule {}
